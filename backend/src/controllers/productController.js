const connection = require('../database/connection');
const entryController = require('./entryController');
const crypto = require('crypto');
module.exports = {

  async create(req,res){

    const {nome,descricao,quantidade,situacao} = req.body;
    const usuario = req.headers.id_usuario;
    const criacao = new Date().toLocaleDateString();
    const id = crypto.randomBytes(4).toString('HEX');

     await connection('produtos')
     .insert({
      id,
      nome,
      descricao,
      quantidade,
      situacao,
      criacao
    })
    .then(res.json({id}).status(201))
    .catch((err)=> res.status(500).json({err}));

    entryController.checkin(id,usuario,descricao,quantidade).then(success=>
      res.json({id})
    ).catch((err)=>{
      console.log(err);
      res.status(500)
    });
    
  },

  async delete(req,res){
    const {id} = req.params;

    await connection('produtos')
    .where('id',id)
    .delete()
    .catch((err)=> res.status(404).json({err}));

    return res.status(204).send();
  },

  async index(req,res){
    const { page = 1} = req.query;

    const [count] = await connection('produtos').count();

    const produtos = await connection('produtos')
    .limit(10)
    .offset((page -1 )*5)
    .select('*')
    .catch((err)=> res.status(404).json({err}))

    res.set('X-Total-Count',count['count(*)']);

    return res.json(produtos);

  }
  
}