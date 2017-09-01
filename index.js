"use strict"

function isValidFio (fio) {
	var arrFio = fio
		.split(" ")
		.filter(function(i){return (i!="")});
	return (arrFio.length == 3);
}

function isValidPhone (phone) {
	var re = /^\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}$/;
	if (!re.test(phone)) {
		return false;
	}
	var arrPhone = phone.split(""), result;
	result = arrPhone.reduce(function(sum, current) {
		if (!isNaN(Number(current))) {
			return sum + Number(current);
		} return sum;
	}, 0);
	return (result<=30);
}

function isValidEmail (email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(email)) {
			return false;
		}
	var arrDomen = [
		"ya.ru", 
		"yandex.ru", 
		"yandex.ua", 
		"yandex.by", 
		"yandex.kz", 
		"yandex.com"];
	for (var current of arrDomen) {
		if (email.indexOf(current)!=-1) {
			return true;
		} 
	} return false;
}


function RegistrationForm(formName) {
	var form = document.forms[formName];
	var resultContainer = document.getElementById("resultContainer");
	var nameFields = ["fio", "email", "phone"];
	var validators = [
		{validator: isValidFio, input: "fio"},
		{validator: isValidEmail, input: "email"},
		{validator: isValidPhone, input: "phone"}];
	var httpRequest;
	
	form.addEventListener("submit",onSubmit.bind(this));

	function onSubmit(event) {
		event.preventDefault();
		this.submit();
	}
	
	function sendAjax(url) {
		httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = resultAjax.bind(this);
		httpRequest.open("GET", url);
		httpRequest.send();
	}

	function resultAjax() {
		resultContainer.classList.remove("success");
		resultContainer.classList.remove("error");
		resultContainer.classList.remove("progress");
		if ( httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) {
				var result = JSON.parse(httpRequest.responseText);
				var status = result.status;
				if (status == "success") {
					resultContainer.classList.add("success");
					resultContainer.textContent = "Success";
				}
				else if(status == "error") {
					resultContainer.classList.add("error");
					resultContainer.textContent = result.reason;
				}
				else if(status == "progress") {
					resultContainer.classList.add("progress");
					setTimeout(sendAjax.bind(this), result.timeout, form.action);
				}
			}
		}
	}

	this.submit = function() {
		for (var field of nameFields) {
			form[field].classList.remove("field-error");
		}
		var resultValidate = this.validate();
		if (resultValidate.isValid) {
			form.submitButton.setAttribute("disabled", true);
			sendAjax(form.action);
		} else { 
			for (var i of resultValidate.errorFields) {
				form[i].classList.add("field-error");
			}
		}
	} 

	this.validate = function() {
		var flag = true, str = [];
		for (var current of validators) {
			if (!current.validator(form[current.input].value)) {
				flag = false;
				str.push(current.input);
			}
		} return ({
			isValid: flag,
			errorFields: str
			});
	}

	this.getData = function() {
		var data = {};
		for (var field of nameFields) {
			data[field] = form[field].value
		}
		return data;		
	}

	this.setData = function(obj) {
		for (var field of nameFields) {
			form[field].value = obj[field] || "";
		}
	}
}

var myForm = new RegistrationForm("myForm");


