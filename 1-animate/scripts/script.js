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

    scaleX =d3.scaleLinear()
        .domain([0, d3.max(data, d => d.milliseconds)])
        .range([0, size.w]);

    scaleY = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([size.h,0]);

    scaleDuration = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.milliseconds)])
        .range([0, 5000]);

    let axisX = d3.axisBottom(scaleX);
    let axisXG = containerG.append('g')
        .classed('axis-x', true)
        .attr('transform', `translate(0, ${size.h})`)
        .call(axisX);

    let axisY = d3.axisLeft(scaleY);

    let axisYG = containerG.append('g')
        .classed('axis-y', true)
        .call(axisY);

    draw(data);

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
            let filteredData = data.filter(e => e.event === d.currentTarget.value);
            draw(filteredData);
        })
}

function draw(data) {
    let circleSel = containerG.selectAll('circle')
        .data(data, d => d.id);

    circleSel
        .enter()
        .append('circle')
        .attr('fill', 'olive')
        .attr('r', 3)
        .attr('cx', 0)
        .attr('cy', d => scaleY(d.date))
        .transition()
        .duration(d => scaleDuration(d.milliseconds))
        .attr('cx', d => scaleX(d.milliseconds));
        // .attr("r",100);
        // .attr('fill','red');

    circleSel
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    circleSel.exit()
        .transition()
        .duration(500)
        .style('opacity', 0)
        .remove();

}
