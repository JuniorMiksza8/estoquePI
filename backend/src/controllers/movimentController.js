const connection = require('../database/connection');
const userController = require('./userController');
const moment =  require('moment');
module.exports = {

  async create(req,res){

    const {produto} = req.params;

    const usuario = req.headers.id_usuario;

    var {quantidade,data_saida,descricao} = req.body;

   
      data_saida = moment(new Date()).format("YYYY-MM-DD");
    

    await connection('movimentacao')
      .insert({
        id_produto : produto,
        id_usuario : usuario,
        quantidade : quantidade,
        data_saida : data_saida,
        descricao : descricao
      })
      .then(res.status(201))
      .catch((err) => {
        res.json({err}).status(500);
        console.log(err);
      })

      await connection('produtos').update({
        quantidade : connection.raw(`?? - ${quantidade}`,['quantidade'])
      }).where('id',produto);
    
    return res.send();
  },

  async index(req,res){

    const {page } = req.query;

    const [count] = await connection('movimentacao').count();
    res.header('X-Total-Count',count['count(*)'])

    if(page && page > 0){

    const movimentacoes =  await connection('movimentacao')
    .join('usuarios','usuarios.id','=','movimentacao.id_usuario')
    .join('produtos','produtos.id','=','movimentacao.id_produto')
    .limit(10)
    .offset((page - 1) * 10)
    .select([
      'movimentacao.id',
      'movimentacao.id_produto',
      'usuarios.email',
      'produtos.nome',
      'movimentacao.descricao',
      'movimentacao.quantidade',
      'movimentacao.data_saida',
      'movimentacao.data_retorno'
    ]).catch((err) => res.json({err}).status(500))

    res.status(200).json(movimentacoes);
    
    }else{

    const movimentacoes =  await connection('movimentacao')
    .join('usuarios','usuarios.id','=','movimentacao.id_usuario')
    .join('produtos','produtos.id','=','movimentacao.id_produto')
    .select([
      'movimentacao.id',
      'movimentacao.id_produto',
      'usuarios.email',
      'produtos.nome',
      'movimentacao.descricao',
      'movimentacao.quantidade',
      'movimentacao.data_saida',
      'movimentacao.data_retorno'
    ]).catch((err) => res.json({err}).status(500))

    res.status(200).json(movimentacoes);
    }

  },

  async return(req,res){
    const data = moment(new Date()).format("YYYY-MM-DD");

    const {id} = req.params;

    await connection('movimentacao').update({
      data_retorno : data
    }).where('id',id).catch((err)=>console.log(err));


    const movimentacao = await connection('movimentacao').select(['id_produto','quantidade']).where('id',id).first();
    await connection('produtos').update({
      quantidade : connection.raw(`?? + ${movimentacao.quantidade}`,['quantidade'])
    }).where('id',movimentacao.id_produto).catch((err)=>console.log(err));
    

    res.status(200).json({});
  }

}