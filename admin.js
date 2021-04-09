// ============================================
// Database
const translations = require("./pt-br.js");
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
  await mongoose.connect("mongodb+srv://CBSOUZA2020:CBSOUZA2020@cluster0.bwekm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
  });

  await server.listen(5500, () => console.log("Server started"));
}

run()
