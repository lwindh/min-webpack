class Scheduler {
    constructor (max) {
        this.max = max
        this.count = 0
        this.queue = []
    }

    async add(promiseCreator) {
        if (this.count >= this.max) {
            await new Promise((resolve, reject) => this.queue.push(resolve))
        }
        this.count++
        let res = await promiseCreator()
        this.count--
        if (this.queue.length) {
            this.queue.shift()()
        }
        return res
    }
}

const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

const scheduler = new Scheduler(2)
const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// 2 3 1 4
  