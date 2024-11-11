// const data = require('./data/user-mentor.json');
// const { ObjectId } = require('mongodb');
// module.exports = {
//   async up(db, client) {
//     // const result =[]
//     // for await (const item of data){
//     //     const name = item['full name']
//     //     const emailArray = name.split(" ")
//     //   let email;
//     //   // //! email
//     //   for (let index = 0; index < emailArray.length; index++) {
//     //     const element = emailArray[index];
//     //     if(emailArray.length > 1){
//     //       if(index === 0){
//     //         email = element.toLowerCase();
//     //       }else{
//     //         email = `${email}${element}@gmail.com`
//     //       }
//     //     }else{
//     //       email = `${element}@gmail.com`
//     //     }
//     //   }
//     //   const user = await db.collection('users').findOne({email: email})
//     //   if(user){
//     //   const professionsData = await db.collection("professions").findOne({_id: new ObjectId(item.profession._id)});
//     //   const roleDate = await db.collection("roles").find({"profession._id": new ObjectId(item.profession._id)}).toArray();
//     //   const skills = getSkills(item)
//     //   const experience = getExperience(item)
//     //   const role = extractRandomRole(roleDate, item.role)
//     //   result.push({
//     //     userId: new ObjectId(user._id),
//     //     skills,
//     //     deleted: false,
//     //     ratings: item.ratings,
//     //     verified: true,
//     //     banned: false,
//     //     experience: experience,
//     //     createdAt: new Date(),
//     //     updatedAt: new Date(),
//     //     bio: item.bio,
//     //     location: {
//     //       city: item.city,
//     //       country: item.country,
//     //       flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
//     //     },
//     //     profession: {
//     //       _id: new ObjectId(item.profession._id),
//     //       name: item.profession.name,
//     //       slag: professionsData?.slag
//     //     },
//     //     role:{
//     //       _id: new ObjectId(role.role._id),
//     //       name: role.role.name,
//     //       slag: role.role.slag
//     //     },
//     //     about: item.bio,
//     //     user:{
//     //       name: user.name,
//     //       email: user.email,
//     //       image: user.image
//     //     },
//     //     tag: item.tab
//     //   })
//     //   }
//     // }

//     // await db.collection('mentors').insertMany(result)
//     console.log('okay');
//   },

//   async down(db, client) {
//     console.log('down');
//     // await db.collection('mentors').deleteMany({})
//   },
// };

// function getSkills(data) {
//   const skills = [];
//   for (const key in data) {
//     if (
//       key.startsWith('skills') &&
//       data[key] !== false &&
//       data[key] !== 'false'
//     ) {
//       skills.push(data[key]);
//     }
//   }

//   return skills;
// }

// function getExperience(data) {
//   const experience = [];

//   let index = 0;
//   while (true) {
//     const roleKey = index === 0 ? 'disignation' : `disignation.${index}`;
//     const companyKey = index === 0 ? 'company' : `company.${index}`;
//     const logoKey = index === 0 ? 'companylogo' : `companylogo ${index + 1}`;

//     if (data[roleKey]) {
//       experience.push({
//         image: data[logoKey] || 'No image available',
//         company: data[companyKey] || 'Company not specified',
//         role: data[roleKey] || 'Role not specified',
//       });
//     } else {
//       break;
//     }
//     index++;
//   }

//   return experience;
// }

// const extractRandomRole = (data, role) => {
//   const roleRegex = new RegExp(role, 'i');
//   const matchingRoles = data.filter((item) => roleRegex.test(item.name));
//   if (matchingRoles.length > 0) {
//     const randomIndex = Math.floor(Math.random() * matchingRoles.length);
//     const matchedRole = matchingRoles[randomIndex];
//     return {
//       role: {
//         _id: matchedRole._id,
//         name: matchedRole.name,
//         slag: matchedRole.slag,
//       },
//     };
//   } else {
//     const randomIndex = Math.floor(Math.random() * data.length);
//     const randomRole = data[randomIndex];
//     return {
//       role: {
//         _id: randomRole._id,
//         name: randomRole.name,
//         slag: randomRole.slag,
//       },
//     };
//   }
// };
