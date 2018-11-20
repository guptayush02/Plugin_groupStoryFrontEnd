$(document).ready(function(){

    // get name and id from chrome storage
    chrome.storage.sync.get(['name', 'user_id'], function(data){
        if(data.name){
            $('.user_name').html('Welcone' + ' ' + data.name);
            $('.user_id').val(data.user_id);
            $('.index').hide();
            $('.content').show();
        }else{
            $('.index').show();
            $('.content').hide();
        }
    });

    // get all story
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/get_story',
        success: function(data){
            if(data.status == 'empty'){
                console.log(data.story)
            }else{
                var len = data.story.length;
                for(var i = 0; i < len; i++){
                    $('.stories').append('<div class="story_info"><span class="story_id">' + data.story[i].id + '</span><div class="story_list">' + 'Story' +  '</div></div>');
                } //data.story[i].description
                $('.story_info').click(function(){
                    var kids = $(this);
                    var storyId = kids.children('span.story_id').html();
                    $.ajax({
                        type: 'get',
                        url: 'http://localhost:8080/story',
                        data: {
                            storyId: storyId
                        },
                        success: function(story){
                            $('.display_box').html(story.data.description);
                            $('.add_story').attr({value: storyId});
                        },
                        error: function(story){
                            console.log('Fail')
                        }
                    });
                });
            }
        },
        error: function(data){
            console.log('error')
        }
    });

    // signup
    $('.signup').click(function(){
        var name = $('.name').val();
        var email = $('.signup_email').val();
        var pass = $('.signup_password').val();
        $.ajax({
            type: 'get',
            url: 'http://localhost:8080/signup',
            data: {
                name: name,
                email: email,
                pass: pass
            },
            success: function(data){
                $('.error').html('Successfully signup. Login!');
                $('.name').val('');
                $('.signup_email').val('');
                $('.signup_password').val('');
            },
            error: function(data){
                $('.error').html('Email already exist');
                $('.signup_email').val('');
                $('.signup_password').val('');
            }
        });
    });

    // login
    $('.login').click(function(){
        var email = $('.login_email').val();
        var pass = $('.login_password').val();
        $.ajax({
            type: 'get',
            url: 'http://localhost:8080/login',
            data: {
                email: email,
                pass : pass
            },
            success: function(data){
                if (data.data) {
                    chrome.storage.sync.set({'name': data.data.name}, function(){
                        $('.user_name').html('Welcone' + ' ' + data.data.name);
                    });
                    chrome.storage.sync.set({'email': data.data.email}, function(){
                        console.log(data.data)
                    });
                    chrome.storage.sync.set({'user_id': data.data.id}, function(){
                        $('.user_id').val(data.data.id);
                    });
                }
                $('.login_email').val('');
                $('.login_password').val('');
                $('.index').hide();
                $('.content').show();
            },
            error: function(data){
                $('.error').html('Email and password not match');
                $('.login_email').val('');
                $('.login_password').val('');
            }
        });
    });

    // signup_form
    $('.signup_button').click(function(){
        $('.signup_form').show();
        $('.login_form').hide();
    });

    // login_form
    $('.login_button').click(function(){
        $('.login_form').show();
        $('.signup_form').hide();
    });

    // post story
    $('.send_story').click(function(){
        var story = $('.input_box').val();
        var userId = $('.user_id').val();
        var addStory = $('.add_story').val();
        var oldStory = $('.display_box').html();
        if (oldStory) {
            story = oldStory + story;
        }
        if (story == '') {
            $('.error').html('Input field is empty');
        }else{
            $.ajax({
                type: 'get',
                url: 'http://localhost:8080/story_post',
                data: {
                    storyId: addStory,
                    story: story,
                    userId: userId
                },
                success: function(data){
                    if(data.status == true){
                        $('.display_box').html(story);
                        $('.stories').append('<div class="story_info"><span class="story_id">' + data.data.id + '</span><div class="story_list">' + 'Story' +  '</div></div>');
                        $('.input_box').val('');
                        
                        $('.story_info').click(function(){
                            var kids = $(this);
                            var storyId = kids.children('span.story_id').html();
                            $.ajax({
                                type: 'get',
                                url: 'http://localhost:8080/story',
                                data: {
                                    storyId: storyId
                                },
                                success: function(story){
                                    $('.display_box').html(story.data.description);
                                    $('.add_story').attr({value: storyId});
                                },
                                error: function(story){
                                    console.log('Fail')
                                }
                            });
                        });
                    }
                },
                error: function(data){
                    $('.error').html('Somthing wrong');
                }
            });
        }
    });

    // // close
    // $('.close').click(function(){
    //     $('.display_box').html('');
    // });

    // logout
    $('.logout').click(function(){
        chrome.storage.sync.remove(['name', 'user_id', 'email'], function(){
            $('.index').show();
            $('.content').hide();
            $('.user_id').val('');
        });
    });
});