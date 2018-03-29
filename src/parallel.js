class Parallel {
    constructor({ parallelJobs }) {
        this.parallelJobs = parallelJobs;
        this.jobs = []
    }

    job(callback) {
        this.jobs.push(callback);
        return this;
    }

    done(callback) {
        Promise.resolve().then(() => {
            const jobsChunks = [];
            while (this.jobs.length > 0) {
                jobsChunks.push(this.jobs.splice(0, this.parallelJobs))
            }

            jobsChunks.reduce((promiseChain, currentJobsChunk) => {
                return promiseChain.then(chainResults =>
                    Promise.all(currentJobsChunk.map(job => new Promise(resolve => job(resolve))))
                        .then(currentResult => [...chainResults, currentResult])
                )
            }, Promise.resolve([])).then(results => callback([].concat(...results)));
        });
    }
}

export default Parallel
