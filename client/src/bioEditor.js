import { Component } from "react";
import "./profile.css";

import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            draft: "",
            editingMode: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/api/user/bio", { bio: this.state.draft })
            .then((res) => {
                console.log(res.data["bio"]);
                this.setState({ draft: res.data["bio"], editingMode: false });
                this.props.updateUser(res.data);
                location.replace("/profile");
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    handleChange(e) {
        this.setState({ draft: e.target.value }, () => {
            console.log(this.state);
        });
    }

    handleClick() {
        this.setState({ editingMode: true });
    }

    render() {
        console.log("bio prop in BioEditor", this.props.bio);

        return (
            <div className="bioeditor">
                {this.state.editingMode && (
                    <form onSubmit={this.handleSubmit}>
                        <textarea
                            defaultValue={this.props.bio}
                            name="draft"
                            onChange={this.handleChange}
                        ></textarea>
                        <button className="buttonEditBio" type="submit">
                            Save
                        </button>
                    </form>
                )}
                {!this.state.editingMode && (
                    <>
                        <p>{this.props.bio}</p>

                        <button
                            className="buttonEditBio"
                            onClick={this.handleClick}
                        >
                            {this.props.bio ? "Edit" : "Add a bio"}
                        </button>
                    </>
                )}
            </div>
        );
    }
}
