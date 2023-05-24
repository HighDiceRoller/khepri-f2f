import {Box, Grid, Stack, Typography} from "@mui/material";
import {
  activePlayer,
  formatPercentage,
  reactivePlayer,
  ascendByWounds,
  twoDecimalPlaces,
  woundsPerOrder,
  activePlayerWithWounds,
  reactivePlayerWithWounds,
  failurePlayerWithNoWounds,
  sumChance
} from './DataTransform';
import { useTheme } from '@mui/material/styles';


function ExpectedWoundsListRow(props){
  const color = props.color;
  const text = props.text;

  return(
  <Stack direction="row" sx={{alignItems: 'center'}} >
            <Box sx={{width: 25, height: 25, display: 'flex', justifyContent: 'center', alignContent: 'center', backgroundColor:color}}>
              <div style={{display:'flex', verticalAlign:'middle', justifyContent: 'center', alignContent: 'center'}}></div>
            </Box>
            <Typography ml={1} mr={1} lineHeight={1} variant="body2">{text}</Typography></Stack>
  )
}

function ExpectedWoundsList(props){
  const theme = useTheme();
  const rows = props.rows
  const activeColors = {
    1: theme.palette.player['active'][300],
    2: theme.palette.player['active'][400],
    3: theme.palette.player['active'][500],
    4: theme.palette.player['active'][600],
    5: theme.palette.player['active'][700],
  }
  const reactiveColors = {
    1: theme.palette.player['reactive'][300],
    2: theme.palette.player['reactive'][400],
    3: theme.palette.player['reactive'][500],
    4: theme.palette.player['reactive'][600],
    5: theme.palette.player['reactive'][700],
  }

  if (rows === null){
    return null;
  }

  const activeList = activePlayerWithWounds(rows);
  const reactiveList = reactivePlayerWithWounds(rows);
  const failureList = failurePlayerWithNoWounds(rows);
  const totalFail = sumChance(failureList);
  const activeNoWounds = activePlayer(failureList);
  const reactiveNoWounds = reactivePlayer(failureList);

  return(
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} lg={12} sx={{textAlign: 'left'}}>
        <Typography>Active ({twoDecimalPlaces(woundsPerOrder(activePlayer(rows)))} wounds / order)</Typography>
        {ascendByWounds(activeList).map((row) => {
         return <ExpectedWoundsListRow key={row.id} color={activeColors[row['wounds']]} text={formatPercentage(row['cumulative_chance']) + "% chance " + row['wounds'] + " or more wounds."}/>
        })}
      </Grid>
      <Grid item xs={12} sm={4} lg={12} sx={{textAlign: 'left'}}>
        <Typography>Failure</Typography>
        <Stack direction="row" sx={{alignItems: 'center'}} key={1}>
          <Box sx={{width: 25,height: 25, display: 'flex', justifyContent: 'center', alignContent: 'center', backgroundColor: 'lightgrey'}}>
            <div style={{display: 'flex', verticalAlign: 'middle', justifyContent: 'center', alignContent: 'center'}}></div>
          </Box>
          <Typography ml={1} mr={1} lineHeight={1} variant="body2">
            {formatPercentage(totalFail)}% chance neither player causes wounds.
          </Typography>
        </Stack>
        {activeNoWounds.map((row) => {
          return <Stack direction="row" sx={{alignItems: 'center'}} key={2}>
            <Box sx={{width: 25,height: 25, display: 'flex', justifyContent: 'center', alignContent: 'center', backgroundColor: 'none'}}>
              <div style={{display: 'flex', verticalAlign: 'middle', justifyContent: 'center', alignContent: 'center'}}></div>
            </Box>
            <Typography ml={1} mr={1} lineHeight={1} variant="body2">
              ({formatPercentage(row['chance'])}% active player causes no wounds.)
            </Typography>
          </Stack>
        })}
        {reactiveNoWounds.map((row) => {
          return <Stack direction="row" sx={{alignItems: 'center'}} key={3}>
            <Box sx={{width: 25,height: 25, display: 'flex', justifyContent: 'center', alignContent: 'center', backgroundColor: 'none'}}>
              <div style={{display: 'flex', verticalAlign: 'middle', justifyContent: 'center', alignContent: 'center'}}></div>
            </Box>
            <Typography ml={1} mr={1} lineHeight={1} variant="body2">
              ({formatPercentage(row['chance'])}% reactive player causes no wounds.)
            </Typography>
          </Stack>
        })}
      </Grid>
      <Grid item xs={12} sm={4} lg={12} sx={{textAlign: 'left'}}>
        <Typography  >Reactive ({twoDecimalPlaces(woundsPerOrder(reactivePlayer(rows)))} wounds / order)</Typography>
        {ascendByWounds(reactiveList).map((row) => {
          return <Stack direction="row" sx={{alignItems: 'center'}} key={row.id}>
            <Box sx={{width: 25, height: 25, display: 'flex', justifyContent: 'center', alignContent: 'center', backgroundColor:reactiveColors[row['wounds']]}}>
              <div style={{display:'flex', verticalAlign:'middle', justifyContent: 'center', alignContent: 'center'}}></div>
            </Box>
            <Typography ml={1} mr={1} lineHeight={1} variant="body2">{formatPercentage(row['cumulative_chance'])}% chance {row['wounds']} or more wounds.</Typography></Stack>
        })}
      </Grid>
    </Grid>
  )
}

export default ExpectedWoundsList;

