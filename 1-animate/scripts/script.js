const margins = {t: 50, r: 50, b: 50, l: 50};
const SVGsize = {w: window.innerWidth*0.8, h: window.innerHeight*0.8};
const size = {
    w: SVGsize.w - margins.l - margins.r,
    h: SVGsize.h - margins.t - margins.b
};
const svg = d3.select('svg')
    .attr('width', SVGsize.w)
    .attr('height', SVGsize.h);
const containerG = svg.append('g')
    .attr('transform', `translate(${margins.l}, ${margins.t})`);


let data, scaleY, scaleX, scaleDuration;

d3.csv('data/data.csv')
.then(function(swimData) {
    data = swimData;
    console.log(data[0]);
    data.forEach(parseData);

    // GETTING UNIQUE VALUES OF ALL EVENTS
    let events = new Set(data.map(d => d.event))
    events = Array.from(events);
    events.push('All'); // adding 'all' for going back to all events

    populateEvents(events);
});

function parseData(d) {
    d.date = new Date(d.date);
    d.distance = +d.distance;
    d.milliseconds = +d.milliseconds;
}

function populateEvents(events) {
    d3.select('select')
        .selectAll('option')
        .data(events)
        .join('option')
        .attr('value', d => d)
        .text(d => d)
        .attr('selected', d => d === 'All')
    
    d3.select('select')
        .on('change', function(d) {
            console.log(d.currentTarget);
        })
}

function draw(data) {

}
