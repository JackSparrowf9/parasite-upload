import queue from "../queues/queue_connection.js";

export const addJob = async ({ name, milliseconds, period, id }) => {
  console.log(`add job: ${name}-${id}`);

  try {
    const existingJob = await queue.getJob(id);
    // console.log(`job.js >> id: ${id} | existingJob: ${existingJob}`);

    if (!existingJob) {
      const job = await addQueue({
        name,
        milliseconds,
        period,
        id,
      });
      return job;
    } else {
      const jobState = await existingJob.getState();

      // console.log(`job.js >> id: ${id} | jobState: ${jobState}`);

      if (jobState === "completed") {
        await existingJob.remove();
        const job = await addQueue({
          name,
          milliseconds,
          period,
          id,
        });
        return job;
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addQueue = async ({ name, milliseconds, period, id }) => {
  if (milliseconds && period) {
    return queue.add(
      name,
      { id: id },
      { delay: milliseconds, jobId: id, priority: period },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  } else if (milliseconds) {
    return queue.add(
      name,
      { id: id },
      { delay: milliseconds, jobId: id },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  } else if (period) {
    return queue.add(
      name,
      { id: id },
      { jobId: id, priority: period },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  } else {
    return queue.add(
      name,
      { id: id },
      { jobId: id },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  }
};

export const uploadNewPdfJob = async ({ name, milliseconds, period, data }) => {
  if (milliseconds && period) {
    return queue.add(
      name,
      { ...data },
      { delay: milliseconds, priority: period },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  } else if (milliseconds) {
    return queue.add(
      name,
      { ...data },
      { delay: milliseconds },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  } else if (period) {
    return queue.add(
      name,
      { ...data },
      { priority: period },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  } else {
    return queue.add(
      name,
      { ...data },
      {
        removeOnComplete: {
          // age: 3600, // keep up to 1 hour
          count: 1000,
        },
        removeOnFail: {
          // age: 24 * 3600, // keep up to 24 hours
          count: 1000,
        },
      }
    );
  }
};
