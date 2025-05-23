import { CardContent, Typography, CardActions, Button, Card, Link, Paper } from "@mui/material";

export default function AwesomeCard(props: any) {
    return (<>
        <Paper elevation={8}>
            <Card 
                style={{ 
                    // minWidth: '30%',
                    // width: '100%',
                    border: '0px dashed grey',
                    margin: '4px',
                    padding: '0px'
                    // flex: 1,
                }}
                variant="outlined">
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, margin: '0px' }}>
                    <Link href={props.link.originUrl}>{props.link.name}</Link>
                    </Typography>
                    {/* <Typography variant="h5" component="div">
                        xxxx
                    </Typography> */}
                    {/* <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography> */}
                    <Typography variant="body2">
                        {props.link.description}
                        <br />
                        {props.link.subscribersCount} / {props.link.watchersCount}
                        <br />
                        {props.link.topics}
                        <br />
                        {props.link.updated}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Paper>
    </>)
}
