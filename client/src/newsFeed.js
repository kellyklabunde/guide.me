import { Component } from "react";
import axios from "./axios";
import "./newsFeed.css";

export default class NewsFeed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newsFeed: [],
        };
    }

    componentDidMount() {
        console.log("NewsFeed Component did mount");

        axios.get("/api/newsfeed").then((res) => {
            console.log("news feed client route");
            console.log(res.data);
            this.setState({ newsFeed: res.data });
            console.log(this.state.newsFeed);
        });
    }

    render() {
        return (
            <div className="container">
                <div className="newsFeed">
                    <p>Check the latest markers from your friends:</p>
                    {this.state.newsFeed.map((news) => (
                        <ul key={news.id}>
                            <div className="newsFeed-userInfo">
                                <img
                                    src={news.image || "/images/profile.png"}
                                />
                                <div>
                                    <h4>
                                        {news.first} {news.last}{" "}
                                    </h4>
                                    <h4>
                                        {" "}
                                        at {news.created_at.slice(
                                            11,
                                            16
                                        )} from {news.created_at.slice(8, 10)}.
                                        {news.created_at.slice(5, 7)}.
                                        {news.created_at.slice(0, 4)}:
                                    </h4>
                                </div>
                            </div>
                            <div className="newsFeed-markerInfo">
                                {news.title}{" "}
                                <img
                                    src={
                                        news.marker_image ||
                                        "/images/profile.png"
                                    }
                                />{" "}
                            </div>
                        </ul>
                    ))}
                </div>
            </div>
        );
    }
}
