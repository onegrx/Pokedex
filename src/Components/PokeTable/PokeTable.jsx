import React from 'react';
import Styles from './PokeTable.scss';
import { connect } from 'react-redux';
import {
    PokelistItem,
    MovelistItem,
} from './Components';

class PokeTableComponent extends React.Component {
    constructor (props) {
        super(props);
        const data = this.props.data;
        let hasLevelValues = data.length && data[0].hasOwnProperty('level_learned_at');
        const pokeHeaders = [
            ['Compare', false],
            ['#', true],
            ['Name', false],
            ['Type', false],
            ['HP', true],
            ['Attack', true],
            ['Defense', true],
            ['Special Attack', true],
            ['Special Defense', true],
            ['Speed', true],
        ];
        const moveHeaders = [
            ['#', true],
            ['Name', false],
            ['Lvl', hasLevelValues ? true : false],
            ['Power', true],
            ['PP', true],
            ['Accuracy', true],
            ['Class', false],
            ['Type', false],
        ];
        const isPoke = this.props.headers === 'pokelist';
        this.headers = isPoke ? pokeHeaders : moveHeaders;
        this.state = {
            sortBy : hasLevelValues ? 'level_learned_at' : 'id',
            sortDir : 1,
            length : isPoke ? 50 : 25,
            increaseBy : isPoke ? 50 : 25,
        };
    }

    changeSorting = sortBy => {
        this.setState({
            sortBy,
            sortDir : this.state.sortDir * (-1),
        });
    };

    handleMouseDown = event => {
        const wrapper = this.wrapper;
        const posX = event.screenX;
        const width = wrapper.clientWidth;
        const totalWidth = wrapper.scrollWidth;
        let previousX = null;
        if (width === totalWidth) {
            return;
        }
        const currentScroll = wrapper.scrollLeft;
        const handleMouseMove = ev => {
            const moveX = ev.screenX;
            if (Math.abs(previousX - moveX) < 3) {
                return;
            }
            previousX = moveX;
            wrapper.scrollLeft = currentScroll + (totalWidth - width) * ((posX - moveX) / (width >> 1));
        }
        const handleMouseUp = ev => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        }
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    handleShowMoreClick = () => {
        this.setState({
            length : this.state.length + this.state.increaseBy,
        });
    };

    createHeaders = headerArray => {
        const headers = headerArray.map((head, i) => {
            let sort = head[0].toLowerCase().replace(' ', '_');
            if (sort === '#') sort = 'id';
            else if (sort === 'Lvl') sort = 'level_learned_at';
            let className = null;
            let clickCallback = null;
            let sortDirectionText = null;
            if (head[1]) {
                className = Styles.sort;
                clickCallback = () => {this.changeSorting(sort)};
                if (this.state.sortBy === sort) {
                    if (this.state.sortDir === 1) {
                        sortDirectionText = '↓';
                    } else {
                        sortDirectionText = '↑';
                    }
                }
            }
            return <th key={i} className={className} onClick={clickCallback}>
                {head[0]}{sortDirectionText}
            </th>;
        });
        return <tr>{headers}</tr>;
    };

    createContent = contentData => {
        const { Item, compare, data } = this.props;
        const content = contentData.map((el, i) => {
            const selected = compare.find(poke => poke.id === el.id);
            return <Item key={el.name} data={el}
                    selected={selected ? true : false} compare={compare} />;
        });
        return content;
    };

    render () {
        const { sortBy, sortDir = 1 } = this.state;
        const { forceMaxLen } = this.props;
        const length = forceMaxLen ? forceMaxLen : this.state.length;
        const data = this.props.data.sort((a, b) => {
            if (sortDir === 1) {
                return a[sortBy] - b[sortBy];
            } else {
                return b[sortBy] - a[sortBy];
            }
        }).slice(0, length);
        let showMore = null;
        if (!forceMaxLen && length < this.props.data.length) {
            showMore = <button onClick={this.handleShowMoreClick} className={Styles.more}>
                Show More
            </button>;
        }
        return <div>
            <div className={Styles.wrapper} ref={w => this.wrapper = w} onMouseDown={this.handleMouseDown}>
                <table className={Styles.table}>
                    <thead className={Styles.thead}>
                        {this.createHeaders(this.headers)}
                    </thead>
                    <tbody className={Styles.tbody}>
                        {this.createContent(data)}
                    </tbody>
                </table>
            </div>
            {showMore}
        </div>;
    }
}

const mapStateToProps = state => ({
    compare : state.compare.pokemon,
});

const PokeTable = connect(mapStateToProps)(PokeTableComponent);

export {
    PokeTable,
    PokelistItem,
    MovelistItem,
};
