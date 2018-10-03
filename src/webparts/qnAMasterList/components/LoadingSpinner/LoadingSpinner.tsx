import * as React from 'react';
import styles from './LoadingSpinner.module.scss';

export class LoadingSpinner extends React.Component<{}, {}> {
    public render() {
        return (
            <div className={styles.loading}>Processing...</div>
        );
    }
}
