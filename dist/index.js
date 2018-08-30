"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FakeTimer = /** @class */ (function () {
    function FakeTimer(date, perf) {
        if (date === void 0) { date = 0; }
        if (perf === void 0) { perf = 0; }
        var _this = this;
        this.date = date;
        this.perf = perf;
        this.mockDateNow = function () { return _this.date; };
        this.mockPerfNow = function () { return _this.perf; };
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
    FakeTimer.prototype.restore = function () {
        Date.now = this.origDateNow;
        if ((typeof performance !== "undefined") && performance) {
            performance.now = this.origPerfNow;
        }
        jest.clearAllTimers();
        jest.useRealTimers();
    };
    /**
     * Advances all timers by msToRun milliseconds. Updates Date.now() and performance.now() return
     * values. All pending "macro-tasks" that have been queued via setTimeout() or setInterval(),
     * and would be executed within this timeframe will be executed.
     */
    FakeTimer.prototype.tick = function (ms) {
        this.date += ms;
        this.perf += ms;
        jest.advanceTimersByTime(ms);
    };
    /**
     * Same as jest.runAllTimers().
     * Exhausts the macro-task queue (i.e., all tasks queued by setTimeout() and setInterval()).
     */
    FakeTimer.prototype.runAllTimers = function () {
        jest.runAllTimers();
    };
    /**
     * Same as jest.runOnlyPendingTimers().
     * Executes only the macro-tasks that are currently pending (i.e., only the
     * tasks that have been queued by setTimeout() or setInterval() up to this point).
     * If any of the currently pending macro-tasks schedule new macro-tasks,
     * those new tasks will not be executed by this call.
     */
    FakeTimer.prototype.runOnlyPendingTimers = function () {
        jest.runOnlyPendingTimers();
    };
    /**
     * Same as jest.runAllTicks().
     * Exhausts the micro-task queue (usually interfaced in node via process.nextTick).
     */
    FakeTimer.prototype.runAllTicks = function () {
        jest.runAllTicks();
    };
    /**
     * Same as jest.runAllImmediates().
     * Exhausts tasks queued by setImmediate().
     */
    FakeTimer.prototype.runAllImmediates = function () {
        jest.runAllImmediates();
    };
    return FakeTimer;
}());
exports.FakeTimer = FakeTimer;
exports.useFakeTimers = function (date, perf) {
    if (date === void 0) { date = 0; }
    if (perf === void 0) { perf = 0; }
    return new FakeTimer(date, perf);
};
