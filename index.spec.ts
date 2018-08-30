import { useFakeTimers, FakeTimer } from "./index";
import { create } from "domain";

describe("FakeTimer", () => {
    describe("useFakeTimers", () => {
        it("should return new instance of FakeTimer respecting params", () => {
            // GIVEN
            const clock = useFakeTimers(1, 2);

            // THEN
            expect(clock).toBeInstanceOf(FakeTimer);

            expect(Date.now()).toBe(1);
            expect(performance.now()).toBe(2);

            clock.restore();
        });
    });

    describe("constructor", () => {
        it("should use jest fake timers", (done) => {
            // GIVEN
            const now = Date.now();
            const clock = useFakeTimers();
            
            // jest doesn't allow to spy on it's own methods, have to use "side effect"
            setTimeout(() => {
                // THEN
                clock.restore();
                expect(Date.now() - now).toBeLessThan(60000);
                done();
            }, 60000);

            // WHEN
            clock.runAllTimers();
        });

        it("should mock Date.now()", () => {
            // WHEN
            const clock = useFakeTimers(1);

            // THEN
            expect(Date.now()).toEqual(1);

            clock.restore();
        });

        it("should mock performance.now()", () => {
            // WHEN
            const clock = useFakeTimers(0, 12345);

            // THEN
            expect(performance.now()).toEqual(12345);

            clock.restore();
        });

        it("should not throw if performance is unavailable", () => {
            // GIVEN
            const perf = performance;
            let clock: FakeTimer;
            const createClock = () => clock = useFakeTimers(1, 2);

            // WHEN
            delete (global as any).performance;

            // THEN
            expect(createClock).not.toThrow();

            clock.restore();
            (global as any).performance = perf;
        });
    });

    describe("restore", () => {
        it("should use real timers", (done) => {
            // GIVEN
            const now = Date.now();
            const clock = useFakeTimers();
            clock.restore();
            
            // jest doesn't allow to spy on it's own methods, have to use "side effect"
            setTimeout(() => {
                // THEN
                expect(Date.now() - now).toBeGreaterThanOrEqual(1000);
                done();
            }, 1000);
        });

        it("should restore Date.now()", () => {
            // WHEN
            const clock = useFakeTimers(1);

            // WHEN
            clock.restore();

            // THEN
            expect(Date.now()).not.toEqual(1);
        });

        it("should restore performance.now()", () => {
            // WHEN
            const clock = useFakeTimers(0, 12345);

            // WHEN
            clock.restore();

            // THEN
            expect(performance.now()).not.toEqual(12345);
        });

        it("should not throw if performance is unavailable", () => {
            // GIVEN
            const perf = performance;

            // WHEN
            delete (global as any).performance;
            const clock = useFakeTimers(1, 2);

            // THEN
            expect(() => clock.restore()).not.toThrow();

            (global as any).performance = perf;
        });
    });

    describe("tick", () => {
        it("should run timeouts", () => {
            // GIVEN
            const clock = useFakeTimers();
            let wasRun = false;
            setTimeout(() => wasRun = true, 60000);

            // WHEN
            clock.tick(30000);

            // THEN
            expect(wasRun).toEqual(false);

            // WHEN
            clock.tick(30000);

            // THEN
            expect(wasRun).toEqual(true);

            clock.restore();
        });

        it("should run intervals", () => {
            // GIVEN
            const clock = useFakeTimers();
            let testValue = 0;
            const interval = setInterval(() => testValue++, 60000);

            // WHEN
            clock.tick(150000);

            // THEN
            expect(testValue).toEqual(2);

            clearInterval(interval);
            clock.restore();
        });

        it("should update Date.now()", () => {
            // GIVEN
            const clock = useFakeTimers(1);

            // WHEN
            clock.tick(1000);

            // THEN
            expect(Date.now()).toEqual(1001);

            clock.restore();
        });

        it("should update performance.now()", () => {
            // GIVEN
            const clock = useFakeTimers(0, 100000);

            // WHEN
            clock.tick(1000);

            // THEN
            expect(performance.now()).toEqual(101000);

            clock.restore();
        });
    });

    describe("runAllTimers", () => {
        it("should run all scheduled timers", () => {
            // GIVEN
            const clock = useFakeTimers();
            let wasRunExtTimer = false;
            let wasRunIntTimer = false;

            setTimeout(() => {
                wasRunExtTimer = true;
                setTimeout(() => {
                    wasRunIntTimer = true;
                }, 60000);
            }, 60000);

            // THEN
            expect(wasRunExtTimer).toEqual(false);
            expect(wasRunIntTimer).toEqual(false);

            // WHEN
            clock.runAllTimers();

            // THEN
            expect(wasRunExtTimer).toEqual(true);
            expect(wasRunIntTimer).toEqual(true);

            clock.restore();
        });
    });

    describe("runOnlyPendingTimers", () => {
        it("should run only pending timers, ignoring newly scheduled ones", () => {
            // GIVEN
            const clock = useFakeTimers();
            let wasRunExtTimer = false;
            let wasRunIntTimer = false;

            setTimeout(() => {
                wasRunExtTimer = true;
                setTimeout(() => {
                    wasRunIntTimer = true;
                }, 60000);
            }, 60000);

            // THEN
            expect(wasRunExtTimer).toEqual(false);
            expect(wasRunIntTimer).toEqual(false);

            // WHEN
            clock.runOnlyPendingTimers();

            // THEN
            expect(wasRunExtTimer).toEqual(true);
            expect(wasRunIntTimer).toEqual(false);

            clock.restore();
        })
    });

    describe("runAllTicks", () => {
        it("should run all microtasks (e.g., process.nextTick)", () => {
            // GIVEN
            const clock = useFakeTimers();
            let wasRunFirstTick = false;
            let wasRunSecondTick = false;

            process.nextTick(() => {
                wasRunFirstTick = true;
                process.nextTick(() => wasRunSecondTick = true);
            });

            // THEN
            expect(wasRunFirstTick).toEqual(false);
            expect(wasRunSecondTick).toEqual(false);

            // WHEN
            clock.runAllTicks();

            // THEN
            expect(wasRunFirstTick).toEqual(true);
            expect(wasRunSecondTick).toEqual(true);

            clock.restore();
        });
    });

    describe("runAllImmediates", () => {
        it("should run all tasks scheduled by setImmediate", () => {
            // GIVEN
            const clock = useFakeTimers();
            let wasRunExtTimer = false;
            let wasRunIntTimer = false;

            setImmediate(() => {
                wasRunExtTimer = true;
                setImmediate(() => {
                    wasRunIntTimer = true;
                });
            });

            // THEN
            expect(wasRunExtTimer).toEqual(false);
            expect(wasRunIntTimer).toEqual(false);

            // WHEN
            clock.runAllImmediates();

            // THEN
            expect(wasRunExtTimer).toEqual(true);
            expect(wasRunIntTimer).toEqual(true);

            clock.restore();
        });
    });
});
