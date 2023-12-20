function figure1() {
    var margin = ({
        top: 15,
        right: 20,
        bottom: 10,
        left: 20
    });

    var image_size_width = 320;
    var image_size_height = 200;

    var indicator_image_size = 30;
    var indicator_image_padding = 5;
    var indicator_box_top_padding = 10;

    var image_padding = 10;

    var num_images = 1;
    var width = num_images * image_size_width + (num_images - 1) * image_padding;
    var height = image_size_height + indicator_image_size + indicator_image_padding + indicator_box_top_padding;

    var base_image_name = 'sample1';
    var base_dir = `images/examples/${base_image_name}/`;
    
    var image_data = [
        { x: 0, y: 0, id: 'display_image_fig1', title: 'What is the instrument held by an ape?'},
    ];

    var indicator_data = [
        { x: 0, y: 0, id: 'sample1', opacity: 1.0, question:'What is the instrument held by an ape?'},
        { x: indicator_image_size + indicator_image_padding, y: 0, id: 'sample2', opacity: 0.2, question:'What animal is drawn on that red signicade?'},
        { x: 2 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample3', opacity: 0.2, question:'At which conference did someone get that black mug?'},
        { x: 3 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample4', opacity: 0.2, question:"What is the color of the child's shoes?"},
        { x: 4 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample5', opacity: 0.2, question:'Where to buy a mug like this based on its logo?'},
        { x: 5 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample6', opacity: 0.2, question:'Tell me the number of that player who is shooting.'},
        { x: 6 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample7', opacity: 0.2, question:'Which company does that little doll belong to?.'},
        { x: 7 * (indicator_image_size + indicator_image_padding), y: 0, id: 'sample8', opacity: 0.2, question:'What kind of drink can we buy from that vending machine?'},

    ]

    var container = d3.select('#figure1_div')
                        .append('svg')
                        .attr('width',  '100%')
                        .attr('height', '100%')
                        .style('min-width', `${(width + margin.left + margin.right ) / 2}px`)
                        // .style('max-width', `${width + margin.left + margin.right}px`)
                        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    var image_group = container
        .append('g')
        .attr('id', 'image_group_fig1')
        .attr('width', width)
        .attr('height', image_size_height)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var text = image_group
        .selectAll('text')
        .data(image_data)
        .enter()
        .append('text')
        .attr('id', function(d) { return d.id + '_title' })
        .style("text-anchor", "middle")
        .style("font-weight", 700)
        .style('font-size', '8px')
        .text(function(d) { return d.title })
        .attr('x', function(d) { return (image_size_width / 2) + d.x })
        .attr('y', -5);

    var indicator_group = container
        .append('g')
        .attr('id', 'indicator_group_fig1')
        .attr('width', 8 * indicator_image_size + 7 * indicator_image_padding)
        .attr('height', indicator_image_size + indicator_image_padding + image_padding+35)
        .attr('transform', `translate(${margin.left}, ${margin.top + image_size_height + 
            image_padding + indicator_box_top_padding})`);

    // indicator_group
    //     .append('text')
    //     .attr('x', indicator_group.attr('width') / 2)
    //     .attr('y', -indicator_box_top_padding / 2)
    //     .attr('text-anchor', 'middle')
    //     .style('font-weight', 700)
    //     .style('font-size', '6px')
    //     .text('Click to select a different example:');

 
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
        base_dir = `images/examples/${base_image_name}/`;
        
        var display_image = image_group.select('#display_image_fig1');
        
        var interp_file = base_dir + 'origin.jpg';
        
        cross_fade_image(display_image, interp_file, image_group, 500);
        
        var question = row.question
        image_group.select('#display_image_fig1_title')
            .text('Question: ' + question);
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
                if (d.id === 'display_image_fig1') {
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
                return "images/examples/" + d.id + '/origin.jpg';
            })
            .attr('id', function(d) { return d.id + '_fig1'; })
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .attr('opacity', function(d) { return d.opacity; })
            .on('click', select_new_image);
    }

    image_init(image_data);

    function changeMainImage() {
        var newImagePath = 'images/examples/' + base_image_name + '/new.jpg'; // Path to the new image
        var displayImage = image_group.select('#display_image_fig1'); // Select the main image by its ID
        displayImage.attr('xlink:href', newImagePath);
    }

    var buttonYPosition = margin.top + image_size_height + image_padding-5;

    var button = container.append('foreignObject')
        .attr('width', 80) // Width of the button
        .attr('height', 15) // Height of the button
        .attr('transform', `translate(${margin.left}, ${buttonYPosition})`)
        .append('xhtml:div') // Use div to control button styling more effectively
        .style('width', 80 + 'px')
        .style('height', 12 + 'px')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .append('xhtml:button')
        .text('Click to see the results')
        .style('font-size', '6px')
        .style('background-color', '#3498db') // Change the background color
        .style('color', '#ffffff') // Change the text color
        .style('border', 'none') // Remove the border
        .style('border-radius', '5px') // Add rounded corners
        .style('cursor', 'pointer') // Change the cursor on hover
        .on('click', changeMainImage);
}

figure1();