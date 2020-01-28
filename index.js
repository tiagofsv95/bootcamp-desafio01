const express = require('express');

const app = express();

app.use(express.json());

/**
 * A variável `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */
const projects = [];

/**
 * Middleware que checa se o projeto existe para poder editar e excliur
 */
function checkProjectExist(req, res, next){
  const { id } = req.params;
  
  const project = projects.find(project => project.id === id);

  if(!project){
    return res.status(400).json({ error: 'Project not found'});
  }

  next();
}

/**
 * Middleware que checa se o projeto não existe para poder adicionar
 */
function checkProjectDoesntExist(req, res, next){
  const { id } = req.body;
  
  const project = projects.find(project => {
    return project.id === id
  });

  if(project){
    return res.status(400).json({ error: 'Project already exist!'});
  }

  next();
}

/**
 * Middleware que dá o log do número de requisições realizadas
 */
function countRequest(req, res, next){
  
  console.count("Número de requisições");

  return next();
  
}

app.use(countRequest);

/**
 * Retorna todos os projetos
 */
app.get('/projects', (req, res) => {
  
  return res.json(projects);

});

/**
 * Request body: id, title
 * Cadastra um novo projeto, caso o id passado não exista
 */
app.post('/projects', checkProjectDoesntExist, (req, res) => {
  const { id, title } = req.body;

  project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(projects);

});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
app.put('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project =>  project.id == id );

  project.title = title;

  return res.json(projects);

});

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
app.delete('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project =>  project.id == id );

  projects.splice(projectIndex, 1);

  return res.json(projects);

});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id; 
 */
app.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project =>  project.id == id );

  project.tasks.push(title);

  return res.json(projects);
});

app.listen(4444);