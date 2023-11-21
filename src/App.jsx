import React, { useEffect, useState } from 'react';
import Table from "./components/Table.jsx";
import axios from "axios";

const App = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const columns = ['select', 'name', 'username', 'email', 'website'];
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
      setLoading(false);
    } catch (e) {
      console.log('e: ', e);
    }
  };
  
  return (
    <div className="container">
      <h3>Reusable Table Component</h3>
      { loading && <p>Loading...</p> }
      { !loading && <Table columns={columns} data={users} itemsPerPage={5} /> }
    </div>
  );
};

export default App;