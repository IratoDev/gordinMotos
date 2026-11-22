import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AssessmentService } from "./avaliacao.service.js";
import { AuthTokenGuard } from "../../auth/guard/auth-token.guard.js";


@Controller('assessment')
export class AssessmentController {

constructor( private readonly assessmentService: AssessmentService){}

/* rotas publicas */

@Post()
create(
@Body() assessmentData:any,
){
    return this.assessmentService.create(assessmentData)
}

@Get('all/assessment')
findAllAproved (){
    return this.assessmentService.findAprovadas()
}


/* rotas admin */
@UseGuards(AuthTokenGuard)
@Get('all/assessment/pendet')
findPendentes(){
    return this.assessmentService.findPendentes()
}

@UseGuards(AuthTokenGuard)
@Patch()
aprovar(
@Body() assessmentData:any, 
){
    return this.assessmentService.aprovar(assessmentData)
}

@UseGuards(AuthTokenGuard)
@Delete(':id')
remove(
@Param('id') id: string
){
    return this.assessmentService.remove(id)
}

}