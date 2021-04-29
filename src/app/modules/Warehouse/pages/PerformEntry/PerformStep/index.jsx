import React, { useMemo, useRef } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import useTrans from 'helper/useTrans';
import { useSelector } from 'react-redux';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Card, CardBody } from '_metronic/_partials/controls';
import CurrentSFA from './CurrentSFA';
import ModalConfirmStep2 from 'app/modules/Warehouse/components/PerformEntry/ModalConfirmStep2';

import './index.scss';

const PerformStep = props => {

    const steps = useSelector(state => state.warehouse.performEntry.steps);

    const location = useLocation();
    const history = useHistory();
    const params = useParams();
    const [trans] = useTrans();
    const modalConfirmRef = useRef();

    const activeStep = useMemo(() => {
        const matchedStep = location.pathname.match(/step-(\d)/g);

        if (matchedStep) return Number(matchedStep[0].split("").pop()) - 1;

        return 0;
    }, [location]);

    const gotoStep = (idx) => {
        if (idx === activeStep + 1) return;

        if (idx > 1 && params?.sfa_id) {
            if (activeStep === 1) modalConfirmRef.current.open(`/warehouse/inbound/step-${idx}/${params?.sfa_id}`)
            else history.push(`/warehouse/inbound/step-${idx}/${params?.sfa_id}`)
        }
    }

    return (
        <Card className="perform-entry-steps">
            <CardBody>

                <ModalConfirmStep2 ref={modalConfirmRef} />

                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label} onClick={() => gotoStep(index + 1)}>
                            <StepLabel>{trans(label)}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <CurrentSFA />
            </CardBody>
        </Card>
    );
};

PerformStep.propTypes = {};

export default PerformStep;
