const Wallet = () => {
  return (
    <div className="container-fluid row d-flex justify-content-center align-items-center mt-4">
      <div className="col-8 d-flex justify-content-between p-4 border border-primary rounded">
        <div>
          <h3>Estimated Balance</h3>
          <h3>
            <b className="me-2">0.00</b>PRM
          </h3>
          <p className="">=$0.00</p>
        </div>
        <div>
          <button className="btn btn-primary mx-1">deposit</button>
          <button className="btn btn-primary mx-1">withdraw</button>
          <button className="btn btn-primary mx-1">transfer</button>
        </div>
      </div>
      <div className="col-8 d-flex justify-content-between my-3 p-4 border border-primary rounded">
        <div>
          <h2>My Assets</h2>
          <p>Coin View</p>
          <div>list...</div>
        </div>
      </div>
      <div className="col-8 d-flex justify-content-between my-3 p-4 border border-primary rounded">
        <div>
          <h2>Recent Transactions</h2>
          <p>no records</p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
