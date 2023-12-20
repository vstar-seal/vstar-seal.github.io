function figure3() {
    var margin = ({
        top: 15,
        right: 20,
        bottom: 10,
        left: 20
    });

    var image_size_width = 260;
    var image_size_height = 100;

    var indicator_image_size = 30;
    var indicator_image_padding = 5;
    var indicator_box_top_padding = 0;

    var image_padding = 0;

    var num_images = 1;
    var width = num_images * image_size_width + (num_images - 1) * image_padding;
    var height = image_size_height + indicator_image_size + indicator_image_padding + indicator_box_top_padding;

    var base_image_name = 'sample1';
    var base_dir = `images/search/${base_image_name}/`;
    
    var image_data = [
        { x: 0, y: 0, id: 'display_image_fig3'},
    ];

    var indicator_data = [
        { x: 0, y: 0, id: 1, opacity: 1.0, image_list:['1.jpg', '2.jpg', '3.jpg']},
        { x: indicator_image_size + indicator_image_padding, y: 0, id: 2, opacity: 0.2, image_list:['1.jpg', '2.jpg', '3.jpg']},
        { x: 2 * (indicator_image_size + indicator_image_padding), y: 0, id: 3, opacity: 0.2, image_list:['1.jpg', '2.jpg']},
        { x: 3 * (indicator_image_size + indicator_image_padding), y: 0, id: 4, opacity: 0.2, image_list:['1.jpg', '2.jpg', '3.jpg', '4.jpg']},
        { x: 4 * (indicator_image_size + indicator_image_padding), y: 0, id: 5, opacity: 0.2, image_list:['1.jpg', '2.jpg', '3.jpg']},
        { x: 5 * (indicator_image_size + indicator_image_padding), y: 0, id: 6, opacity: 0.2, image_list:['1.jpg', '2.jpg']},
    ]

    var container = d3.select('#figure3_div')
                        .append('svg')
                        .attr('width',  '100%')
                        .attr('height', '100%')
                        .style('min-width', `${(width + margin.left + margin.right ) / 2}px`)
                        // .style('max-width', `${width + margin.left + margin.right}px`)
                        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    var image_group = container
        .append('g')
        .attr('id', 'image_group_fig3')
        .attr('width', width)
        .attr('height', image_size_height)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var indicator_group = container
        .append('g')
        .attr('id', 'indicator_group_fig3')
        .attr('width', 6 * indicator_image_size + 5 * indicator_image_padding)
        .attr('height', indicator_image_size + indicator_image_padding + image_padding+35)
        .attr('transform', `translate(${margin.left}, ${margin.top + image_size_height + 
            image_padding + indicator_box_top_padding})`);
    
    var currentSampleIndex = 1
    var currentIndex = 0; // Keep track of the current image index

    // Function to update the image based on currentIndex
    function updateImage() {
        var display_image = image_group.select('#display_image_fig3');
        var newImagePath = 'images/search/' + `sample${currentSampleIndex}` + '/' + indicator_data[currentSampleIndex-1].image_list[currentIndex];
        display_image.attr('xlink:href', newImagePath);
    }

    // Function to handle clicking on the left arrow button
    function onLeftClick() {
        if (currentIndex > 0) {
            currentIndex -= 1; // Decrease index to show previous image
            updateImage();
        }
    }

    // Function to handle clicking on the right arrow button
    function onRightClick() {
        if (currentIndex < indicator_data[currentSampleIndex-1].image_list.length - 1) {
            currentIndex += 1; // Increase index to show next image
            updateImage();
        }
    }

    // Add left arrow button
    image_group.append('text')
        .attr('x', -20) // Position left of the main image
        .attr('y', image_size_height / 2)
        .text('<') // The left arrow symbol
        .style('cursor', 'pointer')
        .on('click', onLeftClick);

    // Add right arrow button
    image_group.append('text')
        .attr('x', image_size_width + 5) // Position right of the main image
        .attr('y', image_size_height / 2)
        .text('>') // The right arrow symbol
        .style('cursor', 'pointer')
        .on('click', onRightClick);
    
    function select_new_image(row, i) {
        currentIndex = 0;
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
        base_dir = `images/search/sample${base_image_name}/`;
        
        var display_image = image_group.select('#display_image_fig3');
        currentSampleIndex =  row.id
        
        var interp_file = base_dir + '1.jpg';
        
        cross_fade_image(display_image, interp_file, image_group, 500);

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
                if (d.id === 'display_image_fig3') {
                    return base_dir + '1.jpg';
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
                return "images/search/" + `sample${d.id}`+ '/origin.jpg';
            })
            .attr('id', function(d) { return d.id + '_fig3'; })
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .attr('opacity', function(d) { return d.opacity; })
            .on('click', select_new_image);
    }

    image_init(image_data);
}

figure3();