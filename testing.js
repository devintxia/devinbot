// unit test for message collection

target = [['word', 'next'], ['is', 'this'], ['this', 'working'], ['working', 'properly?'], ['properly?', '']]
let message = 'is this working properly?'
const messageList = message.split(" ");
let data = [['word', 'next']]
for (let i=0; i<messageList.length; i++) {
    if (i == messageList.length-1) {
        // if you've reached the last word
        const row = [messageList[i], ""];   // no word after!
        data.push(row);
    } else {
        // not at last word
        const row = [messageList[i], messageList[i+1]]
        data.push(row);
    }
}

console.log(data);
console.log(target);
