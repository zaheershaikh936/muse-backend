import mongoose from 'mongoose';

export const getMentorFilter = (filter: Record<string, any>) => {
  const pipeline: mongoose.PipelineStage[] = [];
  const fieldsToMatch = ['profession.slag', 'role.slag', 'location.country'];
  const match: Record<string, any> = {};
  fieldsToMatch.forEach((field) => {
    const value = filter?.[field];
    if (value) {
      match[field] = value;
    }
  });
  if (Object.keys(match).length) pipeline.push({ $match: match });
  if (filter.search) {
    pipeline.push({
      $match: {
        experience: {
          $elemMatch: {
            company: {
              $regex: filter.search,
              $options: 'i',
            },
          },
        },
      },
    });
  }
  if (filter.skills && filter.skills.length) {
    const regexArray = filter.skills.map(
      (skill: string) => new RegExp(skill, 'i'),
    );
    pipeline.push({
      $match: {
        skills: {
          $elemMatch: {
            $in: regexArray,
          },
        },
      },
    });
  }
  if (filter.totalExperience) {
    pipeline.push({
      $match: {
        totalExperience: { $gte: filter.totalExperience },
      },
    });
  }

  return pipeline;
};
