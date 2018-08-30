type ReturnsNumber = () => number;

export class FakeTimer {
    private origDateNow: ReturnsNumber;
    private origPerfNow: ReturnsNumber | undefined;

    constructor(
        private date = 0,
        private perf = 0,
    ) {
        this.origDateNow = Date.now;
        Date.now = this.mockDateNow;

        if ((typeof performance !== "undefined") && performance) {
            this.origPerfNow = performance.now;
            performance.now = this.mockPerfNow;
        }

        jest.useFakeTimers();
    }

    /**
     * Restores Date.now() and performance.now() values. Clears all scheduled fake timers. Stops
     * using fake timers.
     */
    public restore() {
        Date.now = this.origDateNow;
        if ((typeof performance !== "undefined") && performance) {
            performance.now = this.origPerfNow;
        }        

        jest.clearAllTimers();
        jest.useRealTimers();
    }

    /**
     * Advances all timers by msToRun milliseconds. Updates Date.now() and performance.now() return
     * values. All pending "macro-tasks" that have been queued via setTimeout() or setInterval(),
     * and would be executed within this timeframe will be executed.
     */
    public tick(ms: number) {
        this.date += ms;
        this.perf += ms;

        jest.advanceTimersByTime(ms);
    }

    /**
     * Same as jest.runAllTimers().
     * Exhausts the macro-task queue (i.e., all tasks queued by setTimeout() and setInterval()).
     */
    public runAllTimers() {
        jest.runAllTimers();
    }

    /**
     * Same as jest.runOnlyPendingTimers().
     * Executes only the macro-tasks that are currently pending (i.e., only the
     * tasks that have been queued by setTimeout() or setInterval() up to this point).
     * If any of the currently pending macro-tasks schedule new macro-tasks,
     * those new tasks will not be executed by this call.
     */
    public runOnlyPendingTimers() {
        jest.runOnlyPendingTimers();
    }

    /**
     * Same as jest.runAllTicks().
     * Exhausts the micro-task queue (usually interfaced in node via process.nextTick).
     */
    public runAllTicks() {
        jest.runAllTicks();
    }

    /**
     * Same as jest.runAllImmediates().
     * Exhausts tasks queued by setImmediate().
     */
    public runAllImmediates() {
        jest.runAllImmediates();
    }

    private mockDateNow: ReturnsNumber = () => this.date;
    private mockPerfNow: ReturnsNumber = () => this.perf;
}

export const useFakeTimers = (date = 0, perf = 0) => new FakeTimer(date, perf);
