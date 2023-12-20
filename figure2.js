function figure2() {
    var margin = ({
        top: 15,
        right: 20,
        bottom: 10,
        left: 20
    });

    var image_size_width = 320;
    var qa_size_width = 200;
    var image_size_height = 200;

    var indicator_image_size = 45;
    var indicator_image_padding = 5;
    var indicator_box_top_padding = 10;

    var image_padding = 10;

    var num_images = 1;
    var width = num_images * image_size_width + (num_images - 1) * image_padding + qa_size_width;
    var height = image_size_height + indicator_image_size + indicator_image_padding + indicator_box_top_padding;

    var base_image_name = 'sample1';
    var base_dir = `images/sealbench/${base_image_name}/`;
    
    var image_data = [
        { x: 0, y: 0, id: 'display_image_fig2', title: 'What is the color of the clock?'},
    ];

    var indicator_data = [
        { x: 0, y: 0, id: 'sample1', opacity: 1.0, question:'What is the color of the clock?', options:['The color of the clock is green.', 'The color of the clock is black.', 'The color of the clock is red.', 'The color of the clock is yellow.']},
        { x: indicator_image_size + indicator_image_padding, y: 0, id: 'sample2', opacity: 0.2, question:'What is the material of the stool?', options:['The material of the stool is plastic.', 'The material of the stool is wood.', 'The material of the stool is steel.', 'The material of the stool is bamboo.']},
        { x: 2 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample3', opacity: 0.2, question:'Is the red balloon above of white balloon?', options:['The red balloon is below the white balloon.', 'The red balloon is above the white balloon.']},
        { x: 3 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample4', opacity: 0.2, question:'Is the broom on the left or right side of the folded chair?', options:['The broom is on the left side of the folded chair.', 'The broom is on the right side of the folded chair.']},

    ]

    var container = d3.select('#figure2_div')
                        .append('svg')
                        .attr('width',  '100%')
                        .attr('height', '100%')
                        .style('min-width', `${(width + margin.left + margin.right ) / 2}px`)
                        // .style('max-width', `${width + margin.left + margin.right}px`)
                        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    var image_group = container
        .append('g')
        .attr('id', 'image_group_fig2')
        .attr('width', width)
        .attr('height', image_size_height)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add the text content for the question and options on the right of the main image
    var textGroup = container.append('g')
    .attr('transform', `translate(${image_size_width + image_padding + margin.left-10}, ${margin.top})`);

    textGroup.append('text')
        .text('Question:')
        .attr('dy', '1em')
        .style('font-size', '8px')
        .style('font-weight', 'bold');

    // Add the question text
    textGroup.append('text')
        .text('What is the color of the clock?')
        .style('font-size', '8px')
        .attr('dy', '3em');

    textGroup.append('text')
        .text('Options:')
        .attr('dy', '5em')
        .style('font-size', '8px')
        .style('font-weight', 'bold');

    // Add each option as a separate text element
    var options = ['The color of the clock is green.', 'The color of the clock is black.', 'The color of the clock is red.', 'The color of the clock is yellow.'];
    options.forEach(function(option, index) {
        var optionText = textGroup.append('text')
            .text(option)
            .style('font-size', '8px')
            .attr('dy', `${7 + index*2}em`);
        if (index === 0) {
            optionText.style('font-weight', 'bold').style('fill', 'green');
        }
    });

    var indicator_group = container
        .append('g')
        .attr('id', 'indicator_group_fig2')
        .attr('width', 4 * indicator_image_size + 3 * indicator_image_padding)
        .attr('height', indicator_image_size + indicator_image_padding + image_padding+35)
        .attr('transform', `translate(${margin.left}, ${margin.top + image_size_height + 
            image_padding + indicator_box_top_padding})`);

 
    container.selectAll('text').style("font-family", "sans-serif");
    
    function select_new_image(row, i) {
        if (base_image_name === row.id) {
            return;
        }
        var indicator_images = indicator_group.selectAll('image').data(indicator_data)
        indicator_images.attr('opacity', function(d) {
            if (row.id == d.id) {
                return 1.0;
            } else {
                return 0.2
            }
        })
        
        base_image_name = row.id;
        base_dir = `images/sealbench/${base_image_name}/`;
        
        var display_image = image_group.select('#display_image_fig2');
        
        var interp_file = base_dir + 'origin.jpg';
        
        cross_fade_image(display_image, interp_file, image_group, 500);
        // Clear previous question and options
        textGroup.selectAll("*").remove();

        // Add new question text
        textGroup.append('text')
            .text('Question:')
            .attr('dy', '1em')
            .style('font-size', '8px')
            .style('font-weight', 'bold')
            .style("font-family", "sans-serif");

        textGroup.append('text')
            .text(row.question)
            .style('font-size', '8px')
            .attr('dy', '3em')
            .style("font-family", "sans-serif");

        // Check if there are options in the clicked indicator data
        if (row.options) {
            textGroup.append('text')
                .text('Options:')
                .attr('dy', '5em')
                .style('font-size', '8px')
                .style('font-weight', 'bold')
                .style("font-family", "sans-serif");

            // Add each new option as a separate text element
            row.options.forEach(function(option, index) {
                var optionText = textGroup.append('text')
                    .text(option)
                    .style('font-size', '8px')
                    .attr('dy', `${7 + index * 2}em`);

                // Make the first option text bold and green
                if (index === 0) {
                    optionText.style('font-weight', 'bold').style('fill', 'green');
                }
            });
        }
    }

    function image_init(image_data) {
        var images = image_group.selectAll('image').data(image_data);
        var indicator_images = indicator_group.selectAll('image').data(indicator_data);
        
        //Main Images
        images.enter()
            .append('image')
            .attr('width', image_size_width)
            .attr('height', image_size_height)
            .attr('xlink:href', function(d) {
                if (d.id === 'display_image_fig2') {
                    return base_dir + 'origin.jpg';
                } else {
                    return '404.jpg';
                }
            })
            .attr('id', function(d) { return d.id ; })
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; });
        
        //Indicator Images
        indicator_images.enter()
            .append('image')
            .attr('width', indicator_image_size)
            .attr('height', indicator_image_size)
            .attr('xlink:href', function(d) {
                return "images/sealbench/" + d.id + '/origin.jpg';
            })
            .attr('id', function(d) { return d.id + '_fig2'; })
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .attr('opacity', function(d) { return d.opacity; })
            .on('click', select_new_image);
    }

    image_init(image_data);
}

figure2();