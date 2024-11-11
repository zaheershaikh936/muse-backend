// const { ObjectId } = require('mongodb');
// module.exports = {
//   async up(db) {
//     const result = [];
//     for await (const mentor of db.collection('mentors').find()) {
//       result.push({
//         mentor: mentor.user,
//         availability: body,
//         userId: new ObjectId(mentor.userId),
//         mentorId: new ObjectId(mentor._id)
//       })
//       console.log("true", mentor.user.name)
//     }
//     await db.collection('availabilities').insertMany(result);
//   },
//   async down(db) {
//     await db.collection('availabilities').deleteMany({});
//   }
// };


// const body = {
//   "sunday": [
//     {
//       "day": 0,
//       "dayString": "sunday",
//       "startTime": "09:00",
//       "endTime": "09:30",
//       "status": true,

//     },
//     {
//       "day": 0,
//       "dayString": "sunday",
//       "startTime": "13:00",
//       "endTime": "13:30",
//       "status": true,
//     }
//   ],
//   "monday": [
//     {
//       "day": 1,
//       "dayString": "monday",
//       "startTime": "10:00",
//       "endTime": "14:30",
//       "status": true
//     },
//     {
//       "day": 1,
//       "dayString": "monday",
//       "startTime": "15:00",
//       "endTime": "15:30",
//       "status": true
//     }
//   ],
//   "tuesday": [
//     {
//       "day": 2,
//       "dayString": "tuesday",
//       "startTime": "11:00",
//       "endTime": "11:30",
//       "status": true
//     },
//     {
//       "day": 2,
//       "dayString": "tuesday",
//       "startTime": "15:00",
//       "endTime": "15:30",
//       "status": true
//     }
//   ],
//   "wednesday": [
//     {
//       "day": 3,
//       "dayString": "wednesday",
//       "startTime": "09:00",
//       "endTime": "09:30",
//       "status": true
//     },
//     {
//       "day": 3,
//       "dayString": "wednesday",
//       "startTime": "13:00",
//       "endTime": "13:30",
//       "status": true
//     }
//   ],
//   "thursday": [
//     {
//       "day": 4,
//       "dayString": "thursday",
//       "startTime": "10:00",
//       "endTime": "10:30",
//       "status": true
//     },
//     {
//       "day": 4,
//       "dayString": "thursday",
//       "startTime": "14:00",
//       "endTime": "14:30",
//       "status": true
//     }
//   ],
//   "friday": [
//     {
//       "day": 5,
//       "dayString": "friday",
//       "startTime": "11:00",
//       "endTime": "11:30",
//       "status": true
//     },
//     {
//       "day": 5,
//       "dayString": "friday",
//       "startTime": "15:00",
//       "endTime": "15:30",
//       "status": true
//     }
//   ],
//   "saturday": [
//     {
//       "day": 6,
//       "dayString": "saturday",
//       "startTime": "09:00",
//       "endTime": "09:30",
//       "status": true
//     },
//     {
//       "day": 6,
//       "dayString": "saturday",
//       "startTime": "13:00",
//       "endTime": "13:30",
//       "status": true
//     }
//   ]
// }