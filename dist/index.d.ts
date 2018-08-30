export declare class FakeTimer {
    private date;
    private perf;
    private origDateNow;
    private origPerfNow;
    constructor(date?: number, perf?: number);
    /**
     * Restores Date.now() and performance.now() values. Clears all scheduled fake timers. Stops
     * using fake timers.
     */
    restore(): void;
    /**
     * Advances all timers by msToRun milliseconds. Updates Date.now() and performance.now() return
     * values. All pending "macro-tasks" that have been queued via setTimeout() or setInterval(),
     * and would be executed within this timeframe will be executed.
     */
    tick(ms: number): void;
    /**
     * Same as jest.runAllTimers().
     * Exhausts the macro-task queue (i.e., all tasks queued by setTimeout() and setInterval()).
     */
    runAllTimers(): void;
    /**
     * Same as jest.runOnlyPendingTimers().
     * Executes only the macro-tasks that are currently pending (i.e., only the
     * tasks that have been queued by setTimeout() or setInterval() up to this point).
     * If any of the currently pending macro-tasks schedule new macro-tasks,
     * those new tasks will not be executed by this call.
     */
    runOnlyPendingTimers(): void;
    /**
     * Same as jest.runAllTicks().
     * Exhausts the micro-task queue (usually interfaced in node via process.nextTick).
     */
    runAllTicks(): void;
    /**
     * Same as jest.runAllImmediates().
     * Exhausts tasks queued by setImmediate().
     */
    runAllImmediates(): void;
    private mockDateNow;
    private mockPerfNow;
}
export declare const useFakeTimers: (date?: number, perf?: number) => FakeTimer;
