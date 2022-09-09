import React from 'react'

function Signup() {
  return (
    <div className="container my-5">
            <div className="row justify-content-md-center">
                <form className="col-sm-5 border border-primary p-5">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" />
                    </div>
                    <button className="btn btn-primary w-100 mt-3" >Login</button>
                </form>
            </div>
        </div>
  )
}

export default Signup