import React, { Fragment } from 'react'

import profile from '../../../../assets/images/no-img-avatar.png'
import { Link } from 'react-router-dom';

const formBlogData = [
    { name: 'First name', placeholder: 'Jordan Nico', colums: 'col-xl-6' },
    { name: 'Last name', placeholder: 'Jordan Nico', colums: 'col-xl-6' },
    { name: 'Title', placeholder: 'Enter your Title', colums: 'col-xl-12' },
    { name: 'Email Address', placeholder: 'ordanico@mail.com', colums: 'col-xl-12' },
];

const linksBlog = [
    { title: 'Facebook URL' },
    { title: 'Twitter URL' },
    { title: 'Instagram URL' },
    { title: 'Youtube Channel URL' },
]

const EditProfile = () => {
    const [file, setFile] = React.useState(null)
    const fileHandler = (e) => {
        setFile(e.target.files[0]);
    }
    function Removeimg() {
        setFile()
    }
    return (
        <Fragment>
            <div className="row">
                <div className="col-xl-4">
                    <div className="card h-auto">
                        <div className="card-body">
                            <div className="profile text-center">
                                <h6>profile</h6>
                                <div className="setting-img mb-4">
                                    <div className="avatar-upload ">
                                        <div className="avatar-preview">
                                            <div id="imagePreview"
                                                style={{ backgroundImage: file ? "url(" + URL.createObjectURL(file) + ")" : "url(" + profile + ")" }}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h6>Jordan Nico</h6>
                                    <p>Web Designer</p>
                                </div>
                                <div className="row">
                                    <div className="col-xl-4 col-4  border-right">
                                        <div className="text-center ">
                                            <h4 className="mb-0">932</h4>
                                            <p className="mb-0">Finish</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-4  border-right">
                                        <div className="text-center">
                                            <h4 className="mb-0">1932</h4>
                                            <p className="mb-0">Deliver</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-4 border-right">
                                        <div className="text-center">
                                            <h4 className="mb-0">2332</h4>
                                            <p className="mb-0">Deliver</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="change-btn d-flex align-items-center justify-content-center mt-3">
                                    <input type='file' className="form-control ms-0" onChange={fileHandler} id="imageUpload" />
                                    <label htmlFor="imageUpload" className="dlab-upload">Choose File</label>
                                    <Link to="#" className="btn remove-img ms-2" onClick={Removeimg}>Remove</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="bacic-info mb-3">
                                <h4 className="mb-3">Basic info</h4>
                                <div className="row">
                                    {formBlogData.map((item, ind) => (
                                        <div className={`${item.colums}`} key={ind}>
                                            <label className="form-label">{item.name}</label>
                                            <input type="text" className="form-control mb-3" placeholder={item.placeholder} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="exernal-links mb-3">
                                <h4 className="mb-3">External links</h4>
                                <div className="row">
                                    {linksBlog.map((data, ind) => (
                                        <div className="col-xl-12" key={ind}>
                                            <label className="form-label">{data.title}</label>
                                            <input type="text" className="form-control mb-3" placeholder="Past your link here" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="Security">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h4>Security</h4>
                                    <span className="badge badge-sm badge-primary c-pointer" id="ed-profile">Edit</span>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <label className="form-label">Passward</label>
                                        <input type="password" className="form-control mb-3" placeholder="Enter Your Passward" id="password" />
                                        <button className="btn btn-outline-primary float-end ms-3">Cancel</button>
                                        <button className="btn btn-primary float-end">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default EditProfile;