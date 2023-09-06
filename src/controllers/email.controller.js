
//creacion del cuerpo del correo
const emailTemplate = `<div>
        <h1>Bienvenido!!</h1>
        <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="https://www.google.com/">Explorar</a>
</div>`;



//Estructura del correo
const mailOptions = {
    from:"ecommerce",
    to:"bgutierrez.mil@gmail.com",
    subject:"Registro exitoso",
    html:emailTemplate,
};

export const sendEmailController = async (req, res) => {
    try {
      const info = await sendEmail(mailOptions);
      console.log('info: ', info);
      res.json({ status: 'success', message: `Correo enviado a ${mailOptions.to}` });
    } catch (error) {
      console.log(error.message);
      res.json({ status: 'error', message: 'Hubo un error al enviar el correo' });
    }
  };