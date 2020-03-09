const companyEmail = process.env.COMPANYMAIL;

const sgMail = require('@sendgrid/mail');


// whenever there is a change in environment variable restart the server
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeMail = (email, name) => {

  /*
    with single quotes ${} wont work use ` instead
  */
  sgMail.send(
    {
      to : email,
      from : companyEmail,
      subject : `Welcome ${name}`,
      text : `Welcome ${name} to task manager App. You are going to love it.`
    }
  );

};


const sendCancelMail = (email, name) => {

  /*
    with single quotes ${} wont work use ` instead
  */
  sgMail.send(
    {
      to : email,
      from : companyEmail,
      subject : `We'll miss you ${name}`,
      text : `Hope you'll come back ${name}. We'll miss you.`
    }
  );

};

module.exports = {
  sendWelcomeMail,
  sendCancelMail
};



// sgMail.send(msg);