import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import { useParams, useNavigate } from 'react-router-dom';
import AgregarChofer from './AgregarChofer';



export class RegistroChoferClass extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            Chofer: [],
            InfoAdicional: false,
            id_chofer_info:0,
            registroSelect:null,
            redireccion:false,
            modales:false,
            seleccion:'',
          
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
        const url = "http://localhost:8080/api/chofer";
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
                            Chofer: result.body
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
            if(this.state.registroSelect.id_chofer===registro.id_chofer){       
                return(
                    <>
                        <tr key={index}  >
                            <td>{registro.id_chofer}</td>
                            <td>{registro.nombre}</td>
                            <td>{registro.apellido}</td> 
                            <td>{registro.dni}</td>                    
                            <td>{moment.utc(registro.fecha_nacimiento).format('DD/MM/YYYY')}</td>
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
            return(
                <>
                    <tr key={index}  >
                        <td>{registro.id_chofer}</td>
                        <td>{registro.nombre}</td>
                        <td>{registro.apellido}</td>                    
                        <td>{registro.dni}</td>
                        <td>{moment.utc(registro.fecha_nacimiento).format('DD/MM/YYYY')}</td>
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
                            {(this.props.borrar===true&&this.state.seleccion===registro.id_chofer)?
                            (<Link to='' className='btn btn-danger' onClick={() => this.handleClickBorrar(registro)}>
                                <span className="material-symbols-outlined">Eliminar</span>
                            </Link>):null
                            }
                            {(this.props.borrar===true&&this.state.seleccion===registro.id_chofer)?
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
 

    handleClickModificar(registro){
    
        this.setState({redireccion:true , registroSelect: registro});
 //Estado modificar o informar
    }
    
    handleClickSwitch(registro){
    
        var seleccion = this.state.seleccion ; 

        if (seleccion!==''&& seleccion===registro.id_chofer) {
          // Si la clave ya existe en seleccion, la eliminamos
          seleccion='';
        } else {
          // Si la clave no existe, la agregamos
          seleccion = registro.id_chofer;
        }
      
        // Actualizamos el estado 
        this.setState({ seleccion });
    
    }

    handleClickBorrar(registro){
        

 
    let parametros = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'authorization': sessionStorage.getItem('token')
        }
    }  
 
    
 const url = `http://localhost:8080/api/chofer/${registro.id_chofer}`;
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
                toast.success(result.body.message, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
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
        

        const Fila = this.state.Chofer.map((registro, index) => {
            return (
                <>
                    {this.renderInfo(registro,index)}
                </>
            )

        });
        const Form = this.state.redireccion ? (<AgregarChofer registro={this.state.registroSelect} extra={true} />):(null) ;  
// Renderizo la tabla y el formulario para modificar
        

        return (
            <>
            <div className='container bottom'>
            <div className='row'>
                <div className='col'>
                    {this.props.borrar===true ? <h3>Eliminar Chofer</h3>:<h3>Registro de Chofer</h3>};
                </div>
            </div>
                <div className='row'>
                    <div className='col'>
                        
                            <table className="table table-striped table-hover">
                           
                                <thead>
                                    <tr>
                                        <th>
                                            Id_Chofer
                                        </th>
                                        <th>
                                            Nombre
                                        </th>
                                        <th>
                                            Apellido
                                        </th>
                                        <th>
                                            DNI
                                        </th>
                                        <th colSpan={3}>
                                            fecha de Nacimiento
                                        </th>
                                        
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

export default RegistroChofer;


export function RegistroChofer({extra,borrar}) {
   
    const parametros = useParams();
    
    const useNavigateP = useNavigate();
    
    return (
        <>
            <RegistroChoferClass extra={extra} borrar={borrar} useNavigateEnvuelto={useNavigateP} params={parametros} />
        </>
    );
}


  
