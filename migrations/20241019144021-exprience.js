// const { ObjectId } = require('mongodb');

// module.exports = {
//   async up(db, client) {
//     const mentors = await db.collection('mentors').find({}).toArray();

//     for (let mentor of mentors) {
//       const experiences = mentor.experience || [];
//       const result = [];

//       for (let i = 0; i < experiences.length; i++) {
//         const experience = experiences[i];
//         result.push({
//           userId: new ObjectId(mentor.userId),
//           image: experience.image,
//           company: experience.company,
//           country: mentor.location.country,
//           city: mentor.location.city,
//           positions: experiences.map((exp, index) => ({
//             title: exp.role,
//             startDate: new Date('2024-07-01T00:00:00.000Z'),
//             endDate:
//               index === experiences.length - 1
//                 ? null
//                 : new Date('2024-07-01T00:00:00.000Z'),
//             currentlyEmployed: index === experiences.length - 1,
//           })),
//           employmentType: 'Full Time',
//           skills: mentor.skills,
//           createdAt: new Date('2024-10-08T15:34:02.115Z'),
//           updatedAt: new Date('2024-10-08T15:34:02.115Z'),
//         });
//       }

//       if (result.length > 0) {
//         await db.collection('experiences').insertMany(result);
//       }
//     }
//   },

//   async down(db, client) {
//     await db.collection('experiences').deleteMany({});
//   },
// };
