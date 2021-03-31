import { Component } from "react";
import "./profile.css";

import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    handleSubmit(e) {
        e.preventDefault();

        const fd = new FormData();

        fd.append("image", this.state.file);

        axios.post("/api/upload", fd).then((res) => {
            this.props.updateUser(res.data);
            this.props.toggleModal();
            location.replace("/profile");
        });
    }

    render() {
        return (
            <div className="modal">
                <button onClick={this.props.toggleModal} className="close">
                    X
                </button>
                <p>Choose a profile picture</p>
                <h3>Max. 2 MB</h3>
                <form onSubmit={this.handleSubmit}>
                    <input type="file" onChange={this.handleChange}></input>
                    <button className="buttonUploadImg" type="submit">
                        Upload New Image
                    </button>
                </form>
            </div>
        );
    }
}
