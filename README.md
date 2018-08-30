### jest-fake-timers
**jest-fake-timers** is a sinon-alike wrapper around jest built-in fake timers, which adds mocking capability for *Date.now()* and *performance.now()*
### Usage
```
import { useFakeTimers } from "jest-fake-timers";

// init fake timers with 10000 for Date.now() and 500 for performance.now()
const clock = useFakeTimers(10000, 500);

setTimeout(() => {
    console.log(`Date: ${Date.now()}`);
    console.log(`Performance: ${performance.now()}`);
}, 10000);
clock.tick(10000);
// Date: 20000
// Performance: 10500

// reset fake timers and restore real ones
clock.restore();
```
### Methods
* **useFakeTimers(date, perf)** Enables jest fake timers, mocks Date.now() and performance.now() with passed values. Returns instance of **FakeTimer** class.

#### FakeTimer
* **tick(ms)** Advances all scheduled tasks by given milliseconds. Updates Date.now() and performance.now() values.
* **restore()** Clears all scheduled fale timers. Restores Date.now() and performance.now(). Restores real timers.
* **runAllTimers()** Runs [jest.runAllTimers()](https://jestjs.io/docs/en/jest-object#jestrunalltimers)
* **runOnlyPendingTimers** Runs [jest.runOnlyPendingTimers()](https://jestjs.io/docs/en/jest-object#jestrunonlypendingtimers)
* **runAllTicks** Runs [jest.runAllTicks()](https://jestjs.io/docs/en/jest-object#jestrunallticks)
* **runAllImmediates** Runs [jest.runAllImmediates()](https://jestjs.io/docs/en/jest-object#jestrunallimmediates)
