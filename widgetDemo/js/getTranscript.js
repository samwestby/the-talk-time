var tbodyRef = document.getElementById('transcript'); //.getElementsByTagName('tbody')[0];
// csv = d3.csv("/transcripts/csvs/Bdb001.csv");
// console.log(csv);
d3.csv("data/Bdb001.csv", function(data) {
    addTranscriptRow(data.start, data.participant, data.text);
});
// d3.csv("/widgetDemo/data/Bdb001.csv").row(function(d) {
//     console.log(d);
//     addTranscriptRow(d.start, d.text); 
// });


function addTranscriptRow(timestamp, name, utterance) {
    // Add time
    var newRow = document.createElement('div');
    var timeDiv = document.createElement('div');
    var time = document.createElement('div');
    var timeSpan = document.createElement('span')
    newRow.classList.add('transcriptItem');
    newRow.classList.add('row');
    timeDiv.classList.add('col-2');
    time.classList.add("transcriptItem__time");
    timeSpan.innerHTML = timestamp;
    time.appendChild(timeSpan);
    timeDiv.appendChild(time);
    newRow.appendChild(timeDiv);
    
    // Add name
    var idDiv = document.createElement('div');
    var idText = document.createElement('div');
    var idSpan = document.createElement('span')
    idDiv.classList.add('col-2');
    idText.classList.add('transcriptItem_id');
    idSpan.innerHTML = name;
    idText.appendChild(idSpan);
    idDiv.appendChild(idText);
    newRow.appendChild(idDiv);

    //Add utterance
    var textDiv = document.createElement('div');
    var text = document.createElement('div');
    var textSpan = document.createElement('span')
    textDiv.classList.add('col-8');
    text.classList.add('transcriptItem__text');
    textSpan.innerHTML = utterance;
    text.appendChild(textSpan);
    textDiv.appendChild(text);
    newRow.appendChild(textDiv);

    tbodyRef.appendChild(newRow);
}


