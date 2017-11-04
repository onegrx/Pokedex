import React from 'react';
import Styles from './Info.scss';
import {
    PokeType,
    PokeLink,
    DataTable,
} from 'Components';
import { formatName } from 'src/utils';

export default class Info extends React.Component {
    mapAbilities = abilities => {
        return abilities.sort((a, b) => a.slot - b.slot).map(e => {
            const id = e.id;
            const name = e.name;
            const infoText = e.is_hidden ? '(hidden)' : null;
            return <PokeLink key={name}
                    name={name} id={id}
                    info={infoText} type="ability" />
        });
    };

    mapEggGroups = groups => {
        return groups.map(e => {
            return <PokeLink key={e.id} name={e.name} id={e.id} type="egg_group" />;
        });
    };

    getGenderRate = rate => {
        if (rate) {
            return `♂ ${(8 - rate) * 12.5}%`;
        }
        return 'Genderless';
    };

    extractData = data => {
        const tableData = {
            headers : [''],
            data : [
                ['Type'],
                ['Ability'],
                ['Egg Group'],
                ['Gender'],
                ['Base EXP'],
                ['Capture Rate'],
            ],
        };
        data.forEach((pokemon, i) => {
            const ind = i + 1;
            tableData.headers.push(formatName(pokemon.name));
            tableData.data[0][ind] = <PokeType type={pokemon.types} />;
            tableData.data[1][ind] = this.mapAbilities(pokemon.abilities);
            tableData.data[2][ind] = this.mapEggGroups(pokemon.egg_groups);
            tableData.data[3][ind] = this.getGenderRate(pokemon.gender_rate);
            tableData.data[4][ind] = pokemon.base_experience;
            tableData.data[5][ind] = pokemon.capture_rate;
        });
        return tableData;
    };

    render () {
        const data = this.extractData(this.props.data);
        return <div className={Styles.wrapper}>
            <DataTable data={data.data} headers={data.headers} compare={true} />
        </div>;
    }
}