export default function validateCreateAcount(values) {
    let errors = {};
    // Validate user name
    if (!values.name) {
        errors.name = 'El nombre es obligatorio';
    }

    // Validate company
    if (!values.company) {
        errors.company = 'Nombre de Empresa es obligatorio';
    }

    // Validate URL
    if (!values.url) {
        errors.url = 'La URL del producto es obligatoria';
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = 'URL no válida';
    }

    // Validate description
    if (!values.description) {
        errors.description = 'Agrega una descripción de tu producto';
    }

    return errors;
}
