'use strict';

let app = new Vue({
    el: '#root',

    mounted() {
        window.addEventListener('load', function(){
            document.body.style.overflowY = "scroll";
            document.querySelector('.loading').style.display = "none";
        });

        window.addEventListener('beforeunload', function(){
            document.body.style.overflowY = "hidden";
            document.querySelector('.loading').style.display = "flex";
        });

        window.onload = function () {
            let alertBox = document.querySelector('.alert');
            if (alertBox) {
                setTimeout(function () {
                    alertBox.remove();
                }, 5000);
            }
        };

        document.querySelector('.login-button').addEventListener('mouseenter', function(event){
            let login = document.querySelector('.login-box');
            let overlay = document.querySelector('.blur-overlay');

            overlay.style.transition = "opacity 300ms, visibility 300ms, z-index 0s";
            overlay.style.visibility = "visible";
            overlay.style.zIndex = "100";
            overlay.style.opacity = "1";

            login.style.transition = "all 0s";
            login.style.top = (event.clientY - 20) + "px";
            login.style.left = (event.clientX - 160) + "px";
            login.style.visibility = "visible";
            login.style.opacity = "1";
            login.style.zIndex = "101";
        });

        document.querySelector('.blur-overlay').onmouseenter = function(){
            let login = document.querySelector('.login-box');
            let overlay = document.querySelector('.blur-overlay');

            overlay.style.transition = "opacity 300ms, visibility 300ms, z-index 0s 0.5s";
            overlay.style.visiblity = "hidden";
            overlay.style.opacity = "0";
            overlay.style.zIndex = "-100";

            login.style.transition = "all 0.5s";
            login.style.visibility = '0';
            login.style.opacity = '0';
            login.style.zIndex = '-101';
        };
    }, 

    data: {
        errors: [],
        submitDisabled: 'disabled',
    },

    methods: {
        openNav: function() {
            let nav = document.querySelector('.hamburger-nav');
            let wrapper = document.querySelector('.wrapper');

            document.body.style.overflow = "hidden";

            nav.style.transition = "all 500ms";
            nav.style.width = "250px";

            wrapper.style.transition = "all 500ms";
            wrapper.style.marginLeft = "250px";
            wrapper.style.marginRight = "-250px";
        },

        handleSubmitRegister: function() {
            if (this.submitDisabled == "disabled"){
                this.errors = [];
                this.errors.push({message:"Você deve concordar com os Termos de Uso do site para se cadastrar."})

                return false;
            }
            this.errors = [];
            document.querySelector('.register-form').submit();
            return false
        },

        toggleRegisterButton: function() {
            let checkbox = document.querySelector('#concordo');
            let submitButton = document.querySelector('.submit-btn');

            if (!checkbox.checked){
                this.submitDisabled = "disabled";
                submitButton.disabled = true;
            } else {
                this.submitDisabled = "";
                submitButton.disabled = false;
            }
        },
    },
    
});

//Close nav - fora do elemento #root :'(

function closeNav() {
    let nav = document.querySelector('.hamburger-nav');
    let wrapper = document.querySelector('.wrapper');

    document.body.style.overflow = "scroll";

    nav.style.transition = "all 500ms";
    nav.style.width = "0px";

    wrapper.style.transition = "all 500ms";
    wrapper.style.marginLeft = "0px";
    wrapper.style.marginRight = "0px";
}