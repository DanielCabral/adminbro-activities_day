// ============================================
// Database
const translations = require("./pt-br.js");
const theme = require('admin-bro-theme-dark')
const mongoose = require("mongoose");

const ActivitieSchema = new mongoose.Schema({
  data:  { type: Date, default: Date.now },
  horario_de_entrada: { type: Date, default: new Date().getTime() },
  atividades: {
    type:String,
    required: true,
  },
  observações: String,
  horario_de_saida: { type: Date, default: new Date().getTime() },
});

const Activity = mongoose.model("Activity", ActivitieSchema);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    required: true
  }
})
const User = mongoose.model('User',UserSchema)
// ============================================
// Admin Bro
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

// use mongoose in AdminBro
AdminBro.registerAdapter(AdminBroMongoose)

// config
const adminBroOptions = new AdminBro({
  branding: {
    theme,
    companyName: 'Registro de atividades - Colegio Mater Christi',
    logo: 'https://colegiomaterchristi.com.br/wp-content/themes/babykids/include/images/MATER.png',
    favicon: 'https://colegiomaterchristi.com.br/wp-content/uploads/2018/06/mater_EtV_icon.ico'
  },
	resources: [
    { resource: Activity, options: {
      properties: {
        atividades: { type: 'richtext' },
      }
   }},
   User
  ],
  locale: {
    translations: {
      ...translations,
    }
  },
  rootPath: '/admin'
})
const router = AdminBroExpress.buildRouter(adminBroOptions)


// ============================================
// Server
const express = require("express");
const server = express();

server
  .use(adminBroOptions.options.rootPath, router)

// =============================================
// Run App
const run = async () => {
  await mongoose.connect("mongodb+srv://CBSOUZA2020:CBSOUZA_2020@cluster0.bwekm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
  });
  const port = process.env.PORT || 5000;
  await server.listen(port, () => console.log("Server started"));
}

run()
