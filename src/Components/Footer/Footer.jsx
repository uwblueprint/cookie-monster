import React, {Component} from 'react';

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: 0
        };
    }

    render() {
        let madeby = "Made by ";
        return (
            <header>
                <div className="footer-container">
                    <div className="tagline"> {madeby}
                        <a href="https://uwblueprint.org/">UW Blueprint</a>
                    </div>
                </div>
            </header>
        );
    }
}
