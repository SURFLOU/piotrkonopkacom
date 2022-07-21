function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
document.getElementById("age").innerHTML = "Hi, I'm Piotr and I'm " + getAge("2002-09-08") + " years old. I'm a polyglot and a programmer. I want to pursue my carrer in IT with foreign languages further."


