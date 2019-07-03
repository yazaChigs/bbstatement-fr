import { BaseModel } from '../../shared-model/base.model';
import { StockReceivedFrom } from './stock-received-from.model';
import { StockIssuedTo } from './stock-issued-to.model';
import { Branch } from './admin/branch.model';


export class StockQuarantined extends BaseModel {
  // branch: Branch;
  todaysDate: number;
  openingStock: number;
  harareCbd03: number;
  staticHq01: number;
  mobile04: number;
  mobile02: number;
  mobile06: number;
  totalCollections: number;
  referenceLaboratory: number;
  totalReceiptsFromBranches: number;
  p1: number;
  dryPacksD3D4: number;
  p2: number;
  dryPacksD1: number;
  p3: number;
  samplesOnly: number;
  c11: number;
  expired: number;
  wrongPack: number;
  other: number;
  serologicalDiscards: number;
  totalIssuesDiscards: number;
  availableStock: number;
  issueTogroupMismatchesToRefLab: number;
  totalIssues: number;
  ffp1: number;
  plt1: number;
  plt2: number;
  cryo: number;
  stockReceivedFrom: StockReceivedFrom[];
  stockIssuedTo: StockIssuedTo[];
}
