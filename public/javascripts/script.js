'use strict';

let app = new Vue({
    el: '#root',

    mounted() {
        window.onload = function () {
            let alertBox = document.querySelector('.alert');
            if (alertBox) {
                setTimeout(function () {
                    alertBox.remove();
                }, 5000);
            }
        }
    }, 

    data: {
        errors: [],
        submitDisabled: 'disabled',
    },

    methods: {
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
    }
    
});