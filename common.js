function isValidIsraeliID(id) {
    var id = String(id).trim();
    if (id.length > 9 || id.length < 5 || isNaN(id)) return false;

    // Pad string with zeros up to 9 digits
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

    return (
        Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }) %
            10 ===
        0
    );
}

const checkField = (fieldName, value) => {
    if (!value) {
        return false;
    }

    if (fieldName == "id") {
        return isValidIsraeliID(value);
    } else if (fieldName == "lastName" || fieldName == "firstName") {
        if (value > 20) {
            return false;
        }
    } else if (fieldName == "phoneNumber") {
        const phoneRegex = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;
        return phoneRegex.test(value);
    } else if (fieldName == "password") {
        return value.length > 6;
    } else {
        return false;
    }

    return true;
};

const validateAllFields = (id, firstName, lastName, phoneNumber, password) => {
    if (!checkField('firstName', firstName)) {
        return "invalid first name"
    }

    if (!checkField('lastName', lastName)) {
        return "invalid last name"
    }

    if (!checkField('id', id)) {
        return "invalid israeli id"
    }

    if (!checkField('phoneNumber', phoneNumber)) {
        return "invalid phone number"
    }

    if (!checkField('password', password)) {
        return "password must be at least 6 chars "
    }
}

module.exports = {
    validateAllFields,
    checkField,
    isValidIsraeliID
};