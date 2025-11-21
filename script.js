$(document).ready(function(){
    
    var images = [
        "1.jpg", 
        "2.jpg", 
        "3.jpg",
        "4.jpg",
        "5.jpg"
    ];

    var num = 0;
    var timer;

    function updateImage() {
        $("#slider").fadeOut(200, function() {
            $(this).attr("src", images[num]).fadeIn(200);
        });
    }

    function nextSlide() {
        num++;
        if(num >= images.length) {
            num = 0;
        }
        updateImage();
    }

    function prevSlide() {
        num--;
        if(num < 0) {
            num = images.length - 1;
        }
        updateImage();
    }

    function startTimer() {
        timer = setInterval(nextSlide, 3000);
    }
    
    startTimer();

    $("#nextBtn").click(function(){
        clearInterval(timer);
        nextSlide();
        startTimer();
    });

    $("#prevBtn").click(function(){
        clearInterval(timer);
        prevSlide();
        startTimer();
    });

});