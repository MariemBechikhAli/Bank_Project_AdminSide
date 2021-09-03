import React, { Component } from 'react';
import {
  Button, Card, Tag, Divider, Form, Icon, Input, AutoComplete,
  notification, message, Popconfirm
} from "antd";
import axios from "axios";
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 16 },
    lg: { span: 12 }
  }
};


const Personnel = props => (

  <tr className="ant-table-row ant-table-row-level-0" >
    <td className="ant-table-row-cell-break-word" width="90" align="center" >
      <span class="gx-link">{props.personnel.CIN}</span>
    </td>
    <td className="ant-table-row-cell-break-word" align="center" width="150">{props.personnel.NOM}</td>
    <td className="ant-table-row-cell-break-word" align="center" width="100">{props.personnel.Post}</td>
    <td className="ant-table-row-cell-break-word" align="center" >{props.personnel.Numero_telephonique}</td>
    <td className="ant-table-row-cell-break-word" width="90" align="center" >{props.personnel.RIB}</td>
    <td className="ant-table-row-cell-break-word" width="90" align="center" >{props.personnel.Agence}</td>
    <td align="center" >
      <div>
        {props.personnel.Valide ?
          <Tag color="#87d068"> Valide</Tag>
          :
          <Tag color="#EC7063"> Non-valide</Tag>}
      </div>

    </td>
    <td align="center" >
      <Divider orientation="left">
        <Popconfirm title="Voulez vous vraiment supprimer ce compte?"
          onConfirm={() => {
            props.deletePersonnel(props.personnel._id);
          }} onCancel={cancel} okText="Oui" cancelText="Non">
          <Button type="danger" shape="round " size="small"><i className="icon icon-trash" /></Button>
        </Popconfirm>
        <Button type="primary" shape="round " size="small"> <i className="icon icon-edit" /> </Button>
        <Button type="dashed" shape="round " size="small"> <i className="icon icon-check-square" /></Button>


      </Divider></td>
  </tr>
);


const cancel = e => {
  console.log(e);
  message.error('Vous avez cliqué sur "Non"');
}
class UsersList extends Component {
  constructor(props) {
    super(props);
    this.deletePersonnel = this.deletePersonnel.bind(this);
    this.onChangeCIN = this.onChangeCIN.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeNom = this.onChangeNom.bind(this);
    this.onChangePoste = this.onChangePoste.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      personnels: [],
      dataSource: [],
      CIN: "",
      Email: "",
      NOM: "",
      Post: ""
    };
  }

  onChangeCIN(e) {
    this.setState({
      CIN: e.target.value
    });
  }
  onChangeEmail(e) {
    this.setState({
      Email: e.target.value
    });
  }
  onChangeNom(e) {
    this.setState({
      NOM: e.target.value
    });
  }
  onChangePoste(e) {
    this.setState({
      Post: e.target.value
    });
  }
  componentDidMount() {
    axios
      .get('http://localhost:5001/adminSide/personel-list/')
      .then(response => {
        this.setState({ personnels: response.data });
      })
      .catch(error => {
        console.log("error !! " + error);
      });
  }
  personnelList() {
    return this.state.personnels.map(currentpersonnel => {
      return <Personnel personnel={currentpersonnel} key={currentpersonnel._id}
        deletePersonnel={this.deletePersonnel}
      />;
    })
  }
  openNotificationWithIcon = type => {
    notification[type]({
      message: "Personnel ajoué avec succés"
    });
  };
  handlePaginationChange = (e) => {
    const { value } = e.target;
    this.setState({
      pagination: value === 'none' ? false : { position: value },
    });
  };
  myFunction = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
    var x = document.getElementById("user");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("values", values);
      if (!err) {
        const PERS =
        {
          CIN: this.state.CIN,
          NOM: this.state.NOM,
          Email: this.state.Email,
          Post: this.state.Post
        }
        console.log(PERS);
        axios.post('http://localhost:5001/adminSide/addPersonel', PERS)
          .then(res => console.log(res.data));
        this.openNotificationWithIcon("success");
        window.location.reload();
      }
    });

  }
  deletePersonnel = id => {
    axios.delete("http://localhost:5001/adminSide/delete-personel/" + id)
      .then(response => { console.log(response.data) })
      .then(response => message.success('Compte supprimé avec succés'))
  //  message.success('Compte supprimé avec succés');
    this.setState({
      personnels: this.state.personnels.filter(el => el._id !== id)
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const state = this.state;
    return (
      <Card title="Liste de Personnels">

        <Button
          type="dashed"
          className="gx-link gx-btn-link gx-ml-2"
          onClick={this.myFunction}
        >
          Ajouter un personnel <Icon type={this.state.expand ? "up" : "down"} />
        </Button>
        <div id="user" style={{ display: "none" }}>
          <Form onSubmit={this.onSubmit} >
            <FormItem
              {...formItemLayout}
              label="CIN"
              hasFeedback
              value={this.state.CIN}
              onChange={this.onChangeCIN}
            >
              {getFieldDecorator("CIN", {
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire"
                  },
                  {
                    pattern: /^[\d]{0,8}$/,
                    message: "La valeur doit être inférieure à 8 caractères ",
                  }
                ]
              })(<Input style={{ width: '50%' }} placeholder="CIN" type="number" />)}

            </FormItem>

            <FormItem
              {...formItemLayout}
              hasFeedback
              label="E-mail"
              value={this.state.Email}
              onChange={this.onChangeEmail}
            >
              {getFieldDecorator("E-mail", {
                rules: [{
                  required: true,
                  message: "Champs obligatoire",
                }
                ]
              })(<AutoComplete
                dataSource={this.state.dataSource}
                style={{ width: '50%' }}

                placeholder="exemple@exemple.com"
              />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              hasFeedback
              label="Nom complet"
              value={this.state.NOM}
              onChange={this.onChangeNom}
            >
              {getFieldDecorator("Nom complet", {
                rules: [{
                  required: true,
                  message: "Champs obligatoire",
                }]
              })(<Input placeholder="Nom complet" style={{ width: '50%' }} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              hasFeedback
              label="Poste occupé"
              value={this.state.Post}
              onChange={this.onChangePoste}
            >
              {getFieldDecorator("Poste occupé", {
                rules: [{
                  required: true,
                  message: "Champs obligatoire",
                }]
              })(<Input placeholder="Poste occupé" style={{ width: '50%' }} />)}
            </FormItem>
          </Form>
     
          <div class="vertical-center">
                 <Button type="primary" htmlType="submit" onClick={this.onSubmit}
          align="center"
          >
            Ajouter
          </Button>
</div>
        </div>
        <div>
          <table className="table">
            <thead className="ant-table-thead">
              <tr>
                <th className="ant-table-row-cell-break-word">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">CIN</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
                <th className="ant-table-row-cell-break-word">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">Nom complet</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
                <th className="ant-table-row-cell-break-word">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">Poste</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
                <th className="ant-table-row-cell-break-word">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">Telephone</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
                <th className="ant-table-row-cell-break-word">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">RIB</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
                <th className="">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">Agence</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
                <th className="">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">Etat du compte</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
                <th className="ant-table-row-cell-last" align="center">
                  <span className="ant-table-header-column">
                    <div>
                      <span className="ant-table-column-title" align="center">Action</span>
                      <span className="ant-table-column-sorter"></span>
                    </div>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.personnelList()}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
}

export default Form.create()(UsersList);
