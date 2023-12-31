import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import { useParams, useNavigate } from 'react-router-dom';
import AgregarChofer from './AgregarChofer';
import AgregarUsuario from './AgregarUsuario';



export class RegistroUsuarioClass extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            rol:'',
            id_usuario:'',
            permisos:'',
            password:'',
            nickname:'',
            email:'',
            Usuario: [],
            InfoAdicional: false,
            id_usuario_info:0,
            registroSelect:null,
            redireccion:false,
            modales:false,
            seleccion:''
        }

    }

    componentDidMount() {
        
        
        let parametros = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('token')
            }
        }
        sessionStorage.setItem('modifyMyUser', false)
        const url = "http://localhost:8080/api/usuario";
        fetch(url,parametros)
            .then(res => {
               
                return res.json()
                    .then(body => {

                        return {
                            status: res.status,
                            ok: res.ok,
                            headers: res.headers,
                            body: body
                        };
                    })
            }).then(

                result => {
                    if (result.ok) {
                        this.setState({
                            Usuario: result.body
                        });
                    } else {
                        toast.error(result.body.message, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                }
            ).catch(
                (error) => { console.log(error) }
            );
    }
    
    
    renderInfo(registro,index){
        if(this.state.redireccion){    
            if(this.state.registroSelect.id_usuario===registro.id_usuario){       
                return(
                    <>
                        <tr key={index}  >
                            <td>{registro.id_usuario}</td>
                            <td>{registro.nickname}</td>
                            <td>{registro.email}</td> 
                            {/* <td>{registro.password}</td>  */}
                            <td>{registro.rol}</td>                   
                            <td>{registro.permisos}</td>
                            <td>

                                {(this.props.extra===true)?
                                (<Link to='' className='btn btn-warning' onClick={() => this.handleClickModificar(registro)}>
                                    <span class="material-symbols-outlined">Modificar</span>
                                </Link>):null
                                }
                                
                            </td>
                        </tr>

 
                    </>      
                )
            }
            else{
                return(null)
            }
        }
        else{
            if(sessionStorage.getItem('permisos') === '3'){
                return(
                    <>
                        <tr key={index}  >
                            <td>{registro.id_usuario}</td>
                            <td>{registro.nickname}</td>
                            <td>{registro.email}</td>                    
                           
                            <td>{registro.rol}</td>
                            {sessionStorage.getItem('permisos') === '3' ? <td>{registro.permisos}</td>:null}
                            
                            <td>
                                {(this.props.borrar===undefined||this.state.seleccion!=='')?null: 
                                        <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"onClick={() => this.handleClickSwitch(registro)}/>
                                        <label className="form-check-label" for="flexSwitchCheckDefault">Eliminar</label>
                                        </div>
    
                                }
                                {(this.props.extra==='True')?
                                (<Link to='' className='btn btn-warning' onClick={() => this.handleClickModificar(registro)}>
                                    <span class="material-symbols-outlined">Modificar</span>
                                </Link>):null
                                }
                                {(this.props.borrar===true&&this.state.seleccion===registro.id_usuario)?
                                (<Link to='' className='btn btn-danger' onClick={() => this.handleClickBorrar(registro)}>
                                    <span className="material-symbols-outlined">Eliminar</span>
                                </Link>):null
                                }
                                   {(this.props.borrar===true&&this.state.seleccion===registro.id_usuario)?
                                (<Link to='' className='btn btn-success' onClick={() => this.handleClickSwitch(registro)}>
                                    <span className="material-symbols-outlined">Cancelar</span>
                                </Link>):null
                                }
                                
                            </td>
                            <td>                                                
                            </td>
                        </tr>                
                    </>
                )
            }
            else{
                if(sessionStorage.getItem('nickname') === registro.nickname ){
                    sessionStorage.setItem('modifyMyUser', true)
                  
                    return(
                        <>
                            <tr key={index}  >
                                <td>{registro.id_usuario}</td>
                                <td>{registro.nickname}</td>
                                <td>{registro.email}</td>                    
                                {/* {sessionStorage.getItem('permisos') === '3' ? <td>{registro.password}</td>:null} */}
                                {/* <td>{registro.password}</td> */}
                                <td>{registro.rol}</td>
                                <td>{registro.permisos}</td>
                                {/* {sessionStorage.getItem('permisos') === '3' ? <td>{registro.permisos}</td>:null} */}
                                
                                <td>
                                    {(this.props.borrar===undefined||this.state.seleccion!=='')?null: 
                                            <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"onClick={() => this.handleClickSwitch(registro)}/>
                                            <label className="form-check-label" for="flexSwitchCheckDefault">Eliminar</label>
                                            </div>
        
                                    }
                                    {(this.props.extra==='True')?
                                    (<Link to='' className='btn btn-warning' onClick={() => this.handleClickModificar(registro)}>
                                        <span class="material-symbols-outlined">Modificar</span>
                                    </Link>):null
                                    }
                                    {(this.props.borrar===true&&this.state.seleccion===registro.id_usuario)?
                                    (<Link to='' className='btn btn-danger' onClick={() => this.handleClickBorrar(registro)}>
                                        <span className="material-symbols-outlined">Eliminar</span>
                                    </Link>):null
                                    }
                                       {(this.props.borrar===true&&this.state.seleccion===registro.id_usuario)?
                                    (<Link to='' className='btn btn-success' onClick={() => this.handleClickSwitch(registro)}>
                                        <span className="material-symbols-outlined">Cancelar</span>
                                    </Link>):null
                                    }
                                    
                                </td>
                                <td>                                                
                                </td>
                            </tr>                
                        </>
                    )

                }
            }
            
        }
    }
 

    handleClickModificar(registro){
        
        this.setState({redireccion:true , registroSelect: registro});
 //Estado modificar o informar
    }
    
    handleClickSwitch(registro){
       
        var seleccion = this.state.seleccion ; // Copia el objeto seleccion del estado

        if (seleccion!==''&& seleccion===registro.id_usuario) {
          // Si la clave ya existe en seleccion, la eliminamos
          seleccion='';
        } else {
          // Si la clave no existe, la agregamos
          seleccion = registro.id_usuario;
        }
      
        // Actualizamos el estado con la nueva selección
        this.setState({ seleccion });
    
    }

    handleClickBorrar(registro){
        debugger
 //Estado modal activado
       
        // const seleccionJSON = JSON.stringify(this.state.seleccion)

    let parametros = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'authorization': sessionStorage.getItem('token')
        }
    }  
 
   debugger
 const url = `http://localhost:8080/api/usuario/${registro.id_usuario}`;
 fetch(url, parametros)
     .then(res => {
       
         return res.json()
             .then(body => {

                 return {
                     status: res.status,
                     ok: res.ok,
                     headers: res.headers,
                     body: body
                 };
             })
     }).then(

        result => {
           
            if (result.ok) {
                toast.success('Usuario Eliminado', {           //result.body.message
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });       
                debugger 
                // var seleccion = this.state.seleccion ; // Copia el objeto seleccion del estado
                // this.setState({ seleccion });
                this.componentDidMount();
            }else {
                 toast.error(result.body.message, {
                     position: "bottom-center",
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                     theme: "light",
                 });
             }
            
         }
     ).catch(
         (error) => { console.log(error) }
     );
        
    }


    render(){
        
    
        const Fila = this.state.Usuario.map((registro, index) => {
            return (
                <>
                    {this.renderInfo(registro,index)}
                </>
            )

        });
        const Form = this.state.redireccion ? (<AgregarUsuario registro={this.state.registroSelect} extra={true} />):(null) ;  
// Renderizo la tabla y el formulario para modificar
        

        return (
            <>
            <div className='container bottom'>
            <div className='row'>
                <div className='col'>
                    {this.props.borrar===true ? <h3>Eliminar Usuario</h3>:<h3>Registro de Usuarios</h3>};
                </div>
            </div>
                <div className='row'>
                    <div className='col'>
                        
                            <table className="table table-striped table-hover">
                           
                                <thead>
                                    <tr>
                                        <th>
                                            Id_Usuario
                                        </th>
                                        <th>
                                            Nickname
                                        </th>
                                        <th>
                                            Email
                                        </th>
                                        {/* {sessionStorage.getItem('permisos') === '3' || sessionStorage.getItem('modifyMyUser')==='true' ?     <th>
                                            Password
                                        </th>:null} */}
                                      
                                        <th>
                                            Rol
                                        </th>
                                        {sessionStorage.getItem('permisos') === '3'|| sessionStorage.getItem('modifyMyUser')==='true' ?  
                                        <th colSpan={3}>
                                            Permiso
                                        </th>:null}
                                      
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {Fila}

                                </tbody>
                                

                            </table>
                        
                        {Form}
                    </div>
                </div>

            </div>
            </>
        );
    }
}

export default RegistroUsuario;

export function RegistroUsuario({extra,borrar}) {
    const parametros = useParams();
    const useNavigateP = useNavigate();
    return (
        <>
            <RegistroUsuarioClass extra={extra} borrar={borrar} useNavigateEnvuelto={useNavigateP} params={parametros} />
        </>
    );
}


  
