import React, { useState, useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {

  const BaseUrl = "https://localhost:7247/api/Alunos";

  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    alunoId: '',
    nome: '',
    email: '',
    idade: ''
  })

  const ModalControl=()=>{
    setModalIncluir(!modalIncluir);
  }

  const ModalControlEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const HandleChange = e =>{
    const {name,value} = e.target;
    console.log(e.target);
    setAlunoSelecionado({
      ...alunoSelecionado,[name]:value
    });
    console.log(alunoSelecionado);
  }

  const PedidoGet = async() => {
    await axios.get(BaseUrl).then(response => {
      setData(response.data);
    }).catch(error =>{
      console.log(error);
    })
  }

  const PedidoPost = async() => {
    delete alunoSelecionado.alunoId;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);

    await axios.post(BaseUrl, alunoSelecionado).then(response =>{
      setData(data.concat(response.data));
      ModalControl();
    }).catch(error => {
      console.log(error);
    })
  }

  const PedidoPut = async() => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(BaseUrl + "?id=" + alunoSelecionado.alunoId,alunoSelecionado).then(response =>{
      var resposta = response.data;
      var dadosAuxiliares = data;

      dadosAuxiliares.map(aluno=>{
        if(aluno.alunoId == alunoSelecionado.alunoId){
          aluno.nome = resposta.nome;
          aluno.email = resposta.email;
          aluno.idade = resposta.idade;
        }
      });
      ModalControlEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const SelecionarAluno =(aluno, opcao) =>{
    setAlunoSelecionado(aluno);
    (opcao == "Editar") && 
      ModalControlEditar();
  }
  
  useEffect(()=>{
    PedidoGet();
  });
 
  return (
    <div className="App">
      <br/>
      <h3>Cadastro de Alunos</h3>

      <header className="App-header">
        <button id='btn_newStudant' onClick={()=>ModalControl()}>Incluir novo aluno</button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>

          {data.map(aluno => (
            <tr key={aluno.alunoId}>
              <td>{aluno.alunoId}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className='btn btn-primary' onClick={() => SelecionarAluno(aluno, "Editar")}>Editar</button>{"   "}
                <button className='btn btn-danger' onClick={() => SelecionarAluno(aluno, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir aluno</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <br/>
            <label>Nome</label>
            <br/>
            <input type="text" className ="form-control" name='nome' onChange={HandleChange}/>
            <br/>
            <label>Email</label>
            <br/>
            <input type="text" className="form-control" name='email' onChange={HandleChange}/>
            <br/>
            <label>Idade</label>
            <br/>
            <input type="text" className="form-control" name='idade' onChange={HandleChange}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => PedidoPost()}>Adicionar</button>{"  "}
          <button className="btn btn-danger" onClick={() => ModalControl()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar aluno</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <br/> 
            <label>Id</label>
            <br/>
            <input type="text" className = "form-control" readOnly value={alunoSelecionado && alunoSelecionado.alunoId} />
            <br/>
            <label>Nome</label>
            <br/>
            <input type="text" className ="form-control" name='nome' onChange={HandleChange} value ={alunoSelecionado && alunoSelecionado.nome}/>
            <br/>
            <label>Email</label>
            <br/>
            <input type="text" className="form-control" name='email' onChange={HandleChange} value ={alunoSelecionado && alunoSelecionado.email}/>
            <br/>
            <label>Idade</label>
            <br/>
            <input type="text" className="form-control" name='idade' onChange={HandleChange} value ={alunoSelecionado && alunoSelecionado.idade}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => PedidoPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={() => ModalControlEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
