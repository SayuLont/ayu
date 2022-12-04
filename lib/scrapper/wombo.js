const { buildDefaultInstance } = require('wombo-dream-api');
let womboss = async() => {
    const credentials = {
        email: 'najmywardhana123@gmail.com',
        password: 'prasszgatau1',
    };

    // signin is automatically done when you interract with the api if you pass credentials
    const wombo = buildDefaultInstance(credentials);
let hasil = []
    // fetch all styles
    const styles = await wombo.fetchStyles();
    // console.log(styles.map((style) => `[${style.id}] ${style.name}`));
    hasil.push({styles})
return hasil
}
let wombo = async(text,style) => {
const credentials = {
email: 'najmywardhana123@gmail.com',
password: 'prasszgatau1',
};

// signin is automatically done when you interract with the api if you pass credentials
const wombo = buildDefaultInstance(credentials);
// let hasil = []
// generate picture from image
const generatedTask = await wombo.generatePicture(
text,
style,
(taskInProgress) => {
    console.log(
        `[${taskInProgress.id}]: ${taskInProgress.state} | step: ${taskInProgress.photo_url_list.length}`
    );
},
{ weight: 'HIGH' }
);

// console.log(
//     `[${generatedTask.id}]: ${generatedTask.state} | final url: ${generatedTask.result?.final}`
// );
let final = generatedTask.result?.final
// hasil.push({final})
return final
}
module.exports = { wombo,womboss }